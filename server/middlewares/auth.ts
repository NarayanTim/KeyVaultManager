import { getAuth, requireAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { errorMessage, HTTP_STATUS, resFail } from "../utils/res";
import { getUserWithClerkID } from "../lib/user.service";


export type AuthRequest = Request & {
    userID?: string;
}

export const protectRoute = [
    requireAuth(),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { userId: clerkID } = getAuth(req)
            if (!clerkID) {
                return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"Unauthorized - Invalid Token"})
            }
            const user = await getUserWithClerkID(clerkID);
            if (!user) {
                return resFail({res, code:HTTP_STATUS.NOT_FOUND, message:"User not found"})
            }
            req.userID = user.id.toString()
            next()
        } catch (error) {
            next(error)
        }
    }
]