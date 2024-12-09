import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import userModel from '../modules/users/user.model'

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.get('accessToken') ?? ''
  try {
    console.log('token', token)
    userModel.findOne({ token }).then((user) => {
      if (!user)
        return res.status(401).send('Access token mismatched')
      const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET as string)
      if (decodeToken) {
        req.body.user = user
        return next()
      }
      return res.status(401).send('Access token mismatched')
    }).catch((err) => {
      console.log('err', err)
      return res.status(401).send('Access token mismatched')
    })
  } catch (err: any) {
    return res.status(401).send(err.message)
  }
}
