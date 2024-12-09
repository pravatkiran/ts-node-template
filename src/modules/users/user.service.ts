import { IUser, IUserDocument } from './user.interface'
import UserModel, { UserType } from './user.model'
import AppError from '../../errors/app-errors'
import { sign } from 'jsonwebtoken'
import generator from 'generate-password-ts'
import { HttpStatusCode } from '../../utils/output'
import { ERROR_MESSAGES } from '../../utils/message'
import mongoose, { Types } from 'mongoose'
import { encryptPassword } from '../../utils/common/common-fun'
interface ILoginPayload {
  email: string
  password: string,
  userType: UserType
}

class UserService {
  public async createUser(user: ILoginPayload): Promise<IUser> {
    try {
      const existingUser = await UserModel.findOne({ email: user.email })
      if (existingUser) throw new AppError(ERROR_MESSAGES.ALREADY_EXISTS('User'), HttpStatusCode.CONFLICTS)
      let newUser = await UserModel.create(user)
      const tokenData = this.getTokenData(user)
      const token = await this.generateToken(tokenData)
      newUser = newUser.toJSON()
      newUser['token'] = token
      return newUser
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async login({
    email,
    password,
    userType: UserType
  }: ILoginPayload): Promise<IUserDocument> {
    try {
      let user = await UserModel.findOne({ email })
      if (!user) throw new AppError(ERROR_MESSAGES.INVALID_EMAIL, HttpStatusCode.BAD_REQUEST)
      await this.comparePassword(user, password as string)
      const token = await this.generateToken({
        email,
        password,
        userType: UserType,
      })
      user = user.toJSON()
      user['token'] = token
      return user
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }

  // helper function to compare user input plain text password with db's encrypted password
  private async comparePassword(user: IUserDocument, password: string): Promise<Boolean> {
    try {
      const isValid = await user.comparePassword(password as string)
      if (!isValid) throw new AppError(ERROR_MESSAGES.DOESNOT_MATCH('Password'), HttpStatusCode.UNAUTHORIZED)
      return isValid
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async resetPassword(email: string): Promise<string> {
    try {
      const user = await UserModel.findOne({ email })
      if (!user) throw new AppError(ERROR_MESSAGES.REGISTERED_EMAIL, HttpStatusCode.NOT_FOUND)
      const password = generator.generate({
        length: 10,
        numbers: true,
        symbols: false,
        uppercase: true,
        lowercase: true,
        strict: true
      })
      return password
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async getUserDetails(userId: string, phoneNo: number, email: string): Promise<IUserDocument> {
    try {
      let criteria = phoneNo ? { phoneNo } : (email ? { email } : { _id: new mongoose.mongo.ObjectId(userId) })
      const user = await UserModel.findOne(criteria)
      return user as IUserDocument
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }


  private getTokenData(user: ILoginPayload) {
    const tokenData = {
      email: user.email,
      password: user.password,
      userType: user.userType
    }
    return tokenData

  }

  // generate token and add new token to user
  async generateToken(payload: ILoginPayload): Promise<string> {
    const token = sign(payload, process.env.TOKEN_SECRET as string)
    try {
      await UserModel.findOneAndUpdate({ email: payload.email },
        {
          $set: {
            token
          },
        },
        { new: true },
      ).exec()
      return token
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }

  public async updateProfile(user: IUser, id: Types.ObjectId): Promise<IUserDocument> {
    try {
      const { email, phoneNo } = user
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: id },
        {
          $set: { ...user }
        },
        { new: true },
      ).exec()
      if (!updatedUser) throw new AppError(ERROR_MESSAGES.UNABLE_TO_UPDATE('user'), HttpStatusCode.CONFLICTS)
      return updatedUser
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }


  // change password
  public async changePassword(id: string, oldPassword: string, newPassword: string): Promise<IUserDocument> {
    const userId = new mongoose.mongo.ObjectId(id)
    try {
      const existingUser = await UserModel.findOne({ _id: userId })
      if (!existingUser) throw new AppError(ERROR_MESSAGES.NOT_FOUND('user'), HttpStatusCode.NOT_FOUND)
      await this.comparePassword(existingUser, oldPassword)
      const hash = await encryptPassword(newPassword)
      const updatedUser = await UserModel.findOneAndUpdate({ _id: userId },
        {
          $set: {
            password: hash
          }
        },
        { new: true }
      ).exec()
      if (!updatedUser) throw new AppError(ERROR_MESSAGES.UNABLE_TO_UPDATE('password'), HttpStatusCode.CONFLICTS)
      return updatedUser
    } catch (err) {
      if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
  }

}

export default UserService
