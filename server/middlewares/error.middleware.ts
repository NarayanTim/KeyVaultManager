import type {Request, Response, NextFunction,} from "express";
import env from "../config/env.ts";

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    console.error(error);
    
    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        ...(env.ENVIRONMENT === "DEVELOPMENT" && {
            stack: error.stack,
        }),
    });
};