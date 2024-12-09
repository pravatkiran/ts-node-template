import mongoose, { Model, Document } from 'mongoose'
import { DeleteResult } from 'mongodb'
import { ERROR_MESSAGES } from '../message'
import AppError from '../../errors/app-errors'
import { HttpStatusCode } from '../output'


// function to provide item by it's id
export async function getItemById<T extends Document>(model: Model<T>, id: mongoose.Types.ObjectId): Promise<T | null> {
    try {
        const item = await model.findById(id).exec()
        return item
    } catch (err) {
        return null
    }
}

// function to delete single item by id dynamically
export async function deleteItemByid<T extends Document>(model: Model<T>, id: mongoose.Types.ObjectId): Promise<DeleteResult> {
    try {
        return await model.deleteOne({ _id: id }).exec()
    } catch (err) {
        if (err instanceof Error) throw new AppError(err.message, HttpStatusCode.CONFLICTS)
        throw new AppError(ERROR_MESSAGES.SERVER_ERROR, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }
}