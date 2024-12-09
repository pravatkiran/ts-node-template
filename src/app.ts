import express from 'express'
import helmet from 'helmet'
import 'dotenv/config'
import bodyParser from 'body-parser'
import cors from 'cors'
import basicAuth from 'express-basic-auth'
import {connect} from './utils/connect'

import logger from './utils/logger'
import routes from './routes'
// import routes from './routes'

const app = express()
app.use(bodyParser.json({limit:'8mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '2mb'}))

// helmet
app.use(helmet.hidePoweredBy())

// cors 
const corsOptions = {
    "origin":"*",
    "methods":"GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus":204
}
app.use(cors(corsOptions))

app.use(express.json())

app.use(routes)

// basic auth

const port = process.env.PORT
app.listen(port, ()=>{
    logger.info(`app is running on port ${port}`)
    console.log('port', port)
    connect()
})