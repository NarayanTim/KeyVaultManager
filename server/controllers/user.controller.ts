import type { AuthRequest } from "../middlewares/auth.ts"
import type { Response, Request, NextFunction } from "express"
import { errorMessage, HTTP_STATUS, resFail, resSuccess } from "../utils/res.ts"
import { users } from './../models/Users.model.ts';
import { createUser, getUserWithClerkID, getUserWithID } from "../lib/user.service.ts";
import { clerkClient, getAuth } from "@clerk/express";

export const getProfile = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try {
        const userId = req.userID
        console.log("User id: " + userId)
        if (!userId) {
            return resFail({res,code: HTTP_STATUS.UNAUTHORIZED,message: "Unauthorized"});
        }
        const user = await getUserWithID(userId)
        console.log("User: " + JSON.stringify(user, null, 2))
        if (!user) {
            return resFail({res, code:HTTP_STATUS.NOT_FOUND, message:"User not found"})
        }
        console.log("User: " + JSON.stringify(user, null, 2))
        return resSuccess({res, code:HTTP_STATUS.ACCEPTED, data:{user}})
        
    } catch (error) {
        next(error)
    }
}
