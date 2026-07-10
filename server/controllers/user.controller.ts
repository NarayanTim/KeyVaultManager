// import type { AuthRequest } from "../middlewares/auth.ts"
// import type { Response, Request, NextFunction } from "express"
// import { errorMessage, HTTP_STATUS, resFail, resSuccess } from "../utils/res.ts"
// import { users } from './../models/Users.model.ts';
// import { createUser, getUserWithClerkID, getUserWithID } from "../lib/user.service.ts";
// import { clerkClient, getAuth } from "@clerk/express";

// export const getProfile = async (req:AuthRequest, res:Response, next:NextFunction) => {
//     try {
//         const userId = req.userID
//         const user = await getUserWithID(userId)
//         if (!user) {
//             return resFail({res, code:HTTP_STATUS.NOT_FOUND, message:"User not found"})
//         }
//         return resSuccess({res, code:HTTP_STATUS.ACCEPTED, data:{user}})
        
//     } catch (error) {
//         // errorMessage({res, error})
//         next(error)
//     }
// }

// export const getCallback = async (req: Request, res: Response, next:NextFunction) => {
//     try {
//         console.log("========== CALLBACK HIT ==========");
//         const { userId: clerkID } = getAuth(req)
        
//         if (!clerkID) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"Unauthorized"})
//         }
        
//         let user = await getUserWithClerkID(clerkID)
//         if (!user) {
//             const clerkUser = await clerkClient.users.getUser(clerkID)
            
//             user = await createUser({
//                 clerkID, 
//                 name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
//                     : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
//                 email: clerkUser.emailAddresses[0]?.emailAddress,
//             })

//         }
//         resSuccess({res, code:HTTP_STATUS.OK, data:{user}})
        
//     } catch (error) {
//         next(error)
        
//     }
// }