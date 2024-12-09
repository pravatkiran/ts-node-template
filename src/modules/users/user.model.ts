import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUserDocument } from './user.interface'
import { encryptPassword } from '../../utils/common/common-fun'

export enum UserType {
  ADMIN = 1,
  USER
}

const { Schema } = mongoose
const UserSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    email: { type: String, index: true, unique: true, required: true },
    phoneNo: { type: Number, index: true },
    countryCode: { type: String },
    profilePic: { type: String },
    fcmToken: { type: String },
    address: { type: String },
    socialId: { type: String },
    lat: { type: Number },
    long: { type: Number },
    token: { type: String, default: '', index: true },
    userType: {
      type: Number, required: true,
      enum: [
        UserType.ADMIN,
        UserType.USER
      ]
    },
    isSubscribed: { type: Boolean, default: false },
    verifiedEmail: { type: Boolean, default: false },
    verifiedPhone: { type: Boolean, default: false },
    sendEmailNotification: { type: Boolean, default: true },
    sendSmsNotification: { type: Boolean, default: true },
    sendPushNotification: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)
//  pre-save middleware for hashing password
UserSchema.pre('save', async function (next) {
  const user = this as IUserDocument
  if (!user.isModified('password')) return next()
  const hash = await Promise.resolve(encryptPassword(user.password as string))
  user.password = hash
  return next()
})

// schema method to compare password with bcrypt
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const user = this as IUserDocument
  const isValid = await bcrypt.compare(
    candidatePassword,
    user.password as string,
  )
  return isValid
}

const UserModel = mongoose.model<IUserDocument>('users', UserSchema)
export default UserModel
