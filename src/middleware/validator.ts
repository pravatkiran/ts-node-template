import { Request, Response, NextFunction } from 'express'
import Joi, { Schema } from 'joi'
import { HttpStatusCode, sendApiResponse } from '../utils/output'


const validateInput = (schema: Joi.ObjectSchema, fieldName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const input = { [fieldName]: req.body[fieldName] }
        const { error } = schema.validate(input, { abortEarly: false })
        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ')
            return sendApiResponse(res, HttpStatusCode.BAD_REQUEST, { error: errorMessage }, false)
        }
        next()
    };
}


function validateMultipleInput<T>(schema: Schema, fieldNames: string | string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const fieldsArray = Array.isArray(fieldNames) ? fieldNames : [fieldNames]
        const input: { [K in typeof fieldsArray[number]]: T } = {}


        fieldsArray.forEach((fieldName) => {
            input[fieldName] = req.body[fieldName]
        });

        const fieldSchema = Joi.object(
            fieldsArray.reduce((acc, fieldName) => {
                acc[fieldName] = schema
                return acc
            }, {} as { [key: string]: Schema })
        );

        const { error } = fieldSchema.validate(input, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ')
            return sendApiResponse(res, HttpStatusCode.BAD_REQUEST, { error: errorMessage.replace(/"/g, '') }, false)
        }

        next()
    };
}


export const emailValidator = (fieldName: string) => {
    const emailSchema = Joi.object({
        email: Joi.string().email().required(),
    })
    return validateInput(emailSchema, fieldName)

}

export const passwordValidator = (fieldName: string) => {
    const passwordRegExp = /^[a-zA-Z0-9!`@#$%^&*=()]{6,30}$/
    const passwordSchema = Joi.object({
        password: Joi.string().pattern(passwordRegExp).required()
    })
    return validateInput(passwordSchema, fieldName)
}

export const requiredValidators = (keys: string[]) => {
    return validateMultipleInput(Joi.string().required(), keys)
}
