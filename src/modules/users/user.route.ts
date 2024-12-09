import { Router, RequestHandler } from 'express'

import UserController from './user.controller'
import { emailValidator, passwordValidator, requiredValidators } from '../../middleware/validator'
import { isAuth } from '../../middleware/isAuth'

const userRouter = Router()
const userController = new UserController()

userRouter.post('/signup', emailValidator('email'), passwordValidator('password'), userController.signup as RequestHandler)
userRouter.post('/login', emailValidator('email'), passwordValidator('password'), userController.login as RequestHandler)
userRouter.put("/update-profile", isAuth, userController.updateProfile as RequestHandler)
userRouter.patch('/reset-password', emailValidator('email'), userController.resetPassword as RequestHandler)
userRouter.patch('/change-password', requiredValidators(["id", "oldPassword", "newPassword"]), userController.changePassword as RequestHandler)
userRouter.patch("/logout", isAuth, userController.logout as RequestHandler)
userRouter.delete('/deactvate/:id', isAuth, userController.deactivateAccount as RequestHandler)
export default userRouter
