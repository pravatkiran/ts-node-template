import bcrypt from "bcrypt"
import {Response} from "express"
import logger from '../logger'
import AppError from "../../errors/app-errors"
import { HttpStatusCode, sendApiResponse } from "../output"

export interface ErrorResponse {
    status:number
    message: string
}

const handleControllerError = (err:AppError | Error):ErrorResponse =>{
    if(err instanceof AppError){
        return {status: err.statusCode, message: err.message}
    }else {
        logger.error(err)
        return {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Internal Server Error'
        }
    }
}

export const handleErrors = (res:Response, err: AppError):Response<ErrorResponse> =>{
    const errorResponse = handleControllerError(err)
    return sendApiResponse(
        res,
        err.statusCode,
        {message: errorResponse.message},
        false
    )
}

export const encryptPassword = async (password:string):Promise<string>=>{
    const salt = await bcrypt.genSalt(10)
    const hash = bcrypt.hashSync(password,salt)
    return hash
}

export const createLookupStage = (from:string, localField:string, foreignField:string, as:string)=>{
    return {
        $lookup:{
            from,
            localField,
            foreignField,
            as
        }
    }
}

export const createUnwindStage = (path:string)=>{
    return {
        $unwind:{path:path, preserveNullandEmptyArrays:true}
    }
}