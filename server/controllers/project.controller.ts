// import type { AuthRequest } from "../middlewares/auth"
// import type { Response, Request, NextFunction } from "express"
// import { errorMessage, HTTP_STATUS, resFail, resSuccess, resZodIssue } from "../utils/res"
// import { addNewProject, deleteUserProject, generateNewProjectKey, getUserProject, getUserProjects, updateState } from "../lib/project.service"
// import { createProjectSchema } from "../forms/forms"

// export const getProjects = async (req:AuthRequest, res:Response, next:NextFunction) => {
//     try {
//         const userId = req.userID
//         if (!userId) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
//         }
//         const allProjects = await getUserProjects(userId) ?? [];
//         return resSuccess({res, code:HTTP_STATUS.OK, data:{projects: allProjects}, message:"Received all projects"})
        
//     } catch (error) {
//         next(error)
//     }
// }

// export const updateProjectState = async (req:AuthRequest, res:Response, next:NextFunction) => {
//     try {
//         const userId = req.userID
//         if (!userId) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
//         }

//         const projectId = req.params.id?.trim();
//         if (!projectId) {
//             return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
//         }

//         // const project = await getFromID(projectId, user.id);
//         const project = await getUserProject(userId, projectId)
//         if (!project) {
//             return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
//         }

//         // BUG FIX: original referenced `userId.id` (undefined) instead of `user.id`
//         // BUG FIX: original checked `!updateSecret` (wrong variable name)
//         // const updatedProject = await updateState({ projectId, userId: user.id });
//         const updatedProject = await updateState({projectId:projectId, userId:userId})

//         if (!updatedProject) {
//             return resFail({ res, code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to update project" });
//         }

//         return resSuccess({
//             res,
//             code: HTTP_STATUS.OK,
//             data: { project: { name: updatedProject.name, isActive: updatedProject.isActive } },
//             message: "Project state updated",
//         });
        
//     } catch (error) {
//         next(error)
//     }
// }

// export const getProject = async (req:AuthRequest, res:Response, next:NextFunction) => {
//     try {
//         const userId = req.userID
//         if (!userId) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
//         }
//         const projectId = req.params.id?.trim();
//         if (!projectId) {
//             return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
//         }

//         const project = await getUserProject(userId, projectId);
//         if (!project) {
//             return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
//         }

//         return resSuccess({ res, code: HTTP_STATUS.OK, data: { project }, message: "Project found" });

        
//     } catch (error) {
//         next(error)
//     }
// }


// export const addProject = async (req:AuthRequest, res:Response, next:NextFunction) => { 
//     try {
//         const userId = req.userID
//         if (!userId) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
//         }
        
//         // ── Validate body ─────────────────────────────────────────────────────
//         const result = createProjectSchema.safeParse(req.body);
//         if (!result.success) {
//             return resFail({
//                 res,
//                 code: HTTP_STATUS.BAD_REQUEST,
//                 message: resZodIssue(result.error.issues),
//             });
//         }
//         const { name, isActive } = result.data;
//         const addedProject = await addNewProject({name, userId, isActive})
//         if (!addedProject) {
//             return resFail({ res, code: HTTP_STATUS.CONFLICT, message: "Failed to add project" });
//         }
//         return resSuccess({
//             res,
//             code: HTTP_STATUS.CREATED,
//             data: { project: { id: addedProject.id, name: addedProject.name } },
//             message: "Project added",
//         });
        
//     } catch (error) {
//         next(error)
//     }
// }

// export const recreateProjectKey = async (req:AuthRequest, res:Response, next:NextFunction) => {
//     try {
//         const userId = req.userID
//         if (!userId) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
//         }
//         const projectId = req.params.id?.trim();
//         if (!projectId) {
//             return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
//         }

//         const project = await getUserProject(userId, projectId)
//         if (!project) {
//             return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
//         }

//         const projectKeysUpdate = await generateNewProjectKey({projectId})

//         return resSuccess({
//             res, code: HTTP_STATUS.ACCEPTED,
//             data: {
//                 apiKey: projectKeysUpdate?.plainKey,
//                 hashKey: projectKeysUpdate?.keyHash,
//             },
//             message: "Updated the key"
//         })

        
//     } catch (error) {
//         next(error)
//     }
// }


// export const deleteProject = async (req:AuthRequest, res:Response, next:NextFunction) => {
//     try {
//         const userId = req.userID

//         if (!userId) {
//             return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
//         }
//         const projectId = req.params.id?.trim();
//         if (!projectId) {
//             return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
//         }

//         const project = await getUserProject(userId, projectId)
//         if (!project) {
//             return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
//         }

//         const deleted = await deleteUserProject({userId, projectId})
//         if (!deleted) {
//             return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Failed to delete project" });
//         }

//         return resSuccess({
//             res,
//             code: HTTP_STATUS.OK,
//             data: { name: deleted.name },
//             message: "Project removed",
//         });

        
//     } catch (error) {
//         next(error)
//     }
// }