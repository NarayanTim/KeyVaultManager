import type { Response } from "express";
import ENV from "../config/env";

export const HTTP_STATUS = {
    // Success
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;



const FAIL_CODE_NUMBER: number = 500
const FAIL_CODE_MESSAGE : string = "INTERNAL_SERVER_ERROR"


interface ErrorMessage{
    res: Response;
    error: unknown;
    code?: number;
}


interface ResFailMessage{
    res: Response;
    code: number;
    message?: string;
}

interface ResSuccessMessage<T>{
    res: Response;
    code?: number;
    data?: T;
    message?: string;

}



export const errorMessage = ({res, error} : ErrorMessage)  => {
    const err = error instanceof Error ? error : new Error(String(error));

    const functionName = err.stack?.split("\n")[2].trim().split(" ")[1] ?? "Unknown";

    const readString = `Error in [${functionName}] controller: ${err.message}`

    return res.status(FAIL_CODE_NUMBER).json({
        success: false, 
        message: FAIL_CODE_MESSAGE || err.message,
        
    });
}

export const resFail = ({res, code, message="FAIL_CODE_MESSAGE"}: ResFailMessage)  => {
    return res.status(code || FAIL_CODE_NUMBER).json({
        success: false,
        error: {
            message,
        }
        
    })
}


export const resSuccess = <T>({res, code, data, message="Process Completed"}: ResSuccessMessage<T>) : Response  => {
    return res.status(code || HTTP_STATUS.OK).json({
        success: true,
        data,
        message,
    })
}


export const resZodIssue = (zodIssues:unknown[] | [unknown]) : string[] => {
    const fieldErrors: Record<string, string> = {};
    console.log(zodIssues)
    zodIssues?.forEach(err => {
        const field = err.path[0]?.toString() || "general";
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
    });
    return fieldErrors
}
