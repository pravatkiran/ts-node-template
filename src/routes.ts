import { Router } from 'express'
import userRouter from './modules/users/user.route'
import companyRouter from './modules/company/company.route'

const routes = Router()

routes.use('/user', userRouter)
routes.use('/company', companyRouter)


export default routes
