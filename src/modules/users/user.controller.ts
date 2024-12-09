import { Request, Response } from 'express'
import {
  encryptPassword,
  handleErrors,
} from '../../utils/common/common-fun'
import UserModel from './user.model'
import UserService from './user.service'
import { HttpStatusCode, sendApiResponse } from '../../utils/output'
import AppError from '../../errors/app-errors'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/message'
import mongoose from 'mongoose'
import { deleteItemByid } from '../../utils/common/common-service'

const userService = new UserService()

class UserController {
  public async signup(req: Request, res: Response): Promise<Response> {
    try {
      const createUser = await userService.createUser(req.body)
      return sendApiResponse(res, HttpStatusCode.CREATED, createUser, true)
    } catch (err: unknown) {
      return handleErrors(res, err as AppError)
    }
  }

  public async login(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const { email, password, userType } = req.body
      const user = await userService.login({ email, password, userType })
      return sendApiResponse(res, HttpStatusCode.OK, user, true)
    } catch (err: unknown) {
      return handleErrors(res, err as AppError)
    }
  }

  public async updateProfile(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.body.user
      const userId = user._id ? user._id : undefined
      const updatedUser = await userService.updateProfile(req.body, userId)
      return sendApiResponse(res, HttpStatusCode.OK, updatedUser, true)
    } catch (err: unknown) {
      return handleErrors(res, err as AppError)
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body
    try {
      const password = await userService.resetPassword(email)
      if (!password)
        return sendApiResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          { message: ERROR_MESSAGES.RESET_PASSWORD },
          false,
        )

      const hash = await encryptPassword(password)
      await UserModel.findOneAndUpdate({ email }, { password: hash }).exec()
      return sendApiResponse(res, HttpStatusCode.OK, { message: SUCCESS_MESSAGES.RESET_PASSWORD }, true)
    } catch (err: unknown) {
      return handleErrors(res, err as AppError)
    }
  }

  public async logout(req: Request, res: Response): Promise<Response> {
    const user = req.body.user
    const userId = user._id
    if (!userId) return sendApiResponse(res, HttpStatusCode.NOT_FOUND, { message: ERROR_MESSAGES.NOT_FOUND('user') }, false)
    try {
      await UserModel.findOneAndUpdate({ _id: userId }, { $set: { token: "" } }).exec()
      return sendApiResponse(res, HttpStatusCode.OK, { message: SUCCESS_MESSAGES.LOGOUT }, true)
    } catch (err) {
      return handleErrors(res, err as AppError)
    }
  }

  public async deactivateAccount(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    try {
      await deleteItemByid(UserModel, new mongoose.mongo.ObjectId(id))
      return sendApiResponse(res, HttpStatusCode.OK, { message: SUCCESS_MESSAGES.DEACTIVATED }, true)
    } catch (err) {
      return handleErrors(res, err as AppError)
    }
  }

  // change password
  public async changePassword(req: Request, res: Response): Promise<Response> {
    const { id, oldPassword, newPassword } = req.body
    try {
      const user = await userService.changePassword(id, oldPassword, newPassword)
      return sendApiResponse(res, HttpStatusCode.OK, user, true)
    } catch (err) {
      return handleErrors(res, err as AppError)
    }
  }
}


export default UserController
