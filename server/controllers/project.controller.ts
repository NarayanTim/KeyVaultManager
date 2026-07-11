import type { AuthRequest } from "../middlewares/auth.ts"
import type { Response, Request, NextFunction } from "express"
import { errorMessage, HTTP_STATUS, resFail, resSuccess, resZodIssue } from "../utils/res.ts"
import { addNewProject, deleteUserProject, generateNewProjectKey, getUserProject, getUserProjects, updateState } from "../lib/project.service.ts"
import { createProjectSchema } from "../forms/forms.ts"


const PG_UNIQUE_VIOLATION = "23505";

export const getProjects = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }
        const allProjects = await getUserProjects(userId);
        return resSuccess({res, code:HTTP_STATUS.OK, data:{projects: allProjects}, message:"Received all projects"})
        
    } catch (error) {
        next(error)
    }
}

export const updateProjectState = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }

        const projectId = req.params.id?.trim();
        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }

        const project = await getUserProject(userId, projectId)
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }

        // BUG FIX: original referenced `userId.id` (undefined) instead of `user.id`
        // BUG FIX: original checked `!updateSecret` (wrong variable name)
        // const updatedProject = await updateState({ projectId, userId: user.id });
        const updatedProject = await updateState({projectId:projectId, userId:userId})

        if (!updatedProject) {
            return resFail({ res, code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to update project" });
        }

        return resSuccess({
            res,
            code: HTTP_STATUS.OK,
            data: { project: { name: updatedProject.name, isActive: updatedProject.isActive } },
            message: "Project state updated",
        });
        
    } catch (error) {
        next(error)
    }
}

export const getProject = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }
        const projectId = req.params.id?.trim();
        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }

        const project = await getUserProject(userId, projectId);
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }

        return resSuccess({ res, code: HTTP_STATUS.OK, data: { project }, message: "Project found" });

        
    } catch (error) {
        next(error)
    }
}


export const addProject = async (req:AuthRequest, res:Response, next:NextFunction) => { 
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }
        
        // ── Validate body ─────────────────────────────────────────────────────
        const result = createProjectSchema.safeParse(req.body);
        if (!result.success) {
            return resFail({
                res,
                code: HTTP_STATUS.BAD_REQUEST,
                message: resZodIssue(result.error.issues),
            });
        }
        const { name, isActive } = result.data;
        // const addedProject = await addNewProject({name, userId, isActive})
        // if (!addedProject) {
        //     return resFail({ res, code: HTTP_STATUS.CONFLICT, message: "Failed to add project" });
        // }

        try {
            const addedProject = await addNewProject({ name, userId, isActive })
            return resSuccess({
                res,
                code: HTTP_STATUS.CREATED,
                data: { project: { id: addedProject.id, name: addedProject.name } },
                message: "Project added",
            });    
        } catch (error) {
            if (err?.code === PG_UNIQUE_VIOLATION) {
                return resFail({ res, code: HTTP_STATUS.CONFLICT, message: "You already have a project with this name" });
            }
            throw err;
        }



        return resSuccess({
            res,
            code: HTTP_STATUS.CREATED,
            data: { project: { id: addedProject.id, name: addedProject.name } },
            message: "Project added",
        });
        
    } catch (error) {
        next(error)
    }
}

export const recreateProjectKey = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }
        const projectId = req.params.id?.trim();
        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }

        const project = await getUserProject(userId, projectId)
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }

        const projectKeysUpdate = await generateNewProjectKey(projectId)
        if (!projectKeysUpdate) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "No existing key found for this project" });
        }

        return resSuccess({
            res, code: HTTP_STATUS.ACCEPTED,
            data: {
                apiKey: projectKeysUpdate?.plainKey,
                hashKey: projectKeysUpdate?.keyHash,
            },
            message: "Updated the key"
        })
        
    } catch (error) {
        next(error)
    }
}


export const deleteProject = async (req:AuthRequest, res:Response, next:NextFunction) => {
    try {
        const userId = req.userID

        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }
        const projectId = req.params.id?.trim();
        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }

        const project = await getUserProject(userId, projectId)
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }

        const deleted = await deleteUserProject({userId, projectId})
        if (!deleted) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Failed to delete project" });
        }

        return resSuccess({
            res,
            code: HTTP_STATUS.OK,
            data: { name: deleted.name },
            message: "Project removed",
        });

        
    } catch (error) {
        next(error)
    }
}