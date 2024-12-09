import { Response } from "express"

export enum HttpStatusCode{
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICTS = 409,
    INTERNAL_SERVER_ERROR = 500
}

export interface ApiResponse {
    success: boolean,
    message?:object,
    data?:object
}

export const sendApiResponse = (
    res:Response,
    statusCode: HttpStatusCode, 
    data: object | Array<object>,
    success: boolean
):Response => {
    const responseData: ApiResponse = {
        success,
        data
    }
    return res.status(statusCode).json(responseData)
}