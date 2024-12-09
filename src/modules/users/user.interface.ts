import { Document } from 'mongoose'
import { UserType } from './user.model'




export interface IUser extends Document {
  firstName?: string
  lastName?: string
  password: string
  email: string
  phoneNo?: number
  countryCode?: string
  profilePic?: string
  fcmToken?: string
  address?: string
  socialId?: string
  lat?: number
  long?: number
  token?: string
  userType: UserType
  isSubscribed?: boolean
  verifiedEmail: boolean
  verifiedPhone: boolean
  sendEmailNotification: boolean
  sendSmsNotification: boolean
  sendPushNotification: boolean
}

export interface IUserDocument extends IUser {
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
  generateToken(): string
}

