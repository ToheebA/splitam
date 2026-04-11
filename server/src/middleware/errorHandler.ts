import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from '../errors/index'

interface MongoError extends Error {
    code?: number
    keyValue?: Record<string, string>
    errors?: Record<string, { message: string }>
}

const ErrorHandler = (err: MongoError, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    if (err.code === 11000 && err.keyValue) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `${field} already exists` })
    }
    if (err.name === "ValidationError" && err.errors) {
        const messages = Object.values(err.errors).map((e) => e.message)
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages })
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Something went wrong" })
}

export default ErrorHandler