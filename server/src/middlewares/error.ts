import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

import {config} from '../config/environment'

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500
    if (err?.code) {
        statusCode = err.code
    }
    if (err?.statusCode) {
        statusCode = err.statusCode
    }

    let message = err.message

    if (config.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR]
    }

    res.locals.errorMessage = err.message

    const response = {
        code: statusCode,
        message,
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    }

    console.log('Error: ', {
        message: err.message,
        stack: err.stack,
        statusCode,
    })
    
    res.status(statusCode).send(response)
}