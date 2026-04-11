import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
    statusCode: number
    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
    }
}

class BadRequestError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST)

    }
}

class NotFoundError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.NOT_FOUND)
    }
}

class UnauthenticatedError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED)
    }
}

class ForbiddenError extends CustomAPIError {
    constructor(message: string) {
        super(message, StatusCodes.FORBIDDEN)
    }
}

export { 
    CustomAPIError, 
    BadRequestError, 
    NotFoundError, 
    UnauthenticatedError, 
    ForbiddenError 
}