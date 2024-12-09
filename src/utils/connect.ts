import mongoose from 'mongoose'
import logger from './logger'

export const connect = async ()=>{
    const dbUri = process.env.MONGO_URI
    try{
        await mongoose.connect(dbUri as string)
        logger.info("Db connected successfully")
    }catch(err){
        logger.error("Could not connect to db")
        process.exit(1)
    }
}