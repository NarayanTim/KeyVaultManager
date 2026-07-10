import type { AuthRequest } from "../middlewares/auth"
import type { Response, Request, NextFunction } from "express"
import { errorMessage, HTTP_STATUS, resFail, resSuccess } from "../utils/res"
import { getUserProject } from "../lib/project.service"
import { addProjectAPIKey, deleteProjectSecretKey, getAllSecretsKeys, getSecretById, keyNameExist, updateKeyState } from "../lib/secret.service"
import { createSecretSchema } from "../forms/forms"
import { resZodIssue } from './../utils/res';
export const addAPIKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }

        const projectId = req.params.id?.trim();
        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }

        // const project = await getFromID(projectId, user.id);
        const project = await getUserProject(userId, projectId)
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }

        const result = createSecretSchema.safeParse(req.body);
        if (!result.success) {
            return resFail({
                res,
                code: HTTP_STATUS.BAD_REQUEST,
                message: resZodIssue(result.error.issues),
            });
        }

        const { secretName, encryptedValue } = result.data;
        const alreadyExists = await keyNameExist({ projectId, secretName });
        if (alreadyExists) {
            return resFail({ res, code: HTTP_STATUS.CONFLICT, message: "Secret name already exists in this project" });
        }

        const newAPIKey = await addProjectAPIKey({ userID, projectID, keyName:secretName, keyValue:encryptedValue })
        if (!newAPIKey) {
            return resFail({ res, code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to create secret" });
        }
        return resSuccess({
            res, code: HTTP_STATUS.CREATED,
            data: {
                id: newAPIKey.id,
                secretName : newAPIKey.secretName,
            },
            message: "Secret created successfully"
        })

    } catch (error) {
        next(error)
    }
}


export const getAllProjectKeys = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
        const allKeys = await getAllSecretsKeys(projectId) ?? []
        return resSuccess({res, code:HTTP_STATUS.OK, data:{keys:allKeys}, message:"All keys retrieved"})
        
    } catch (error) {
        next(error)
    }
}

export const updateKeyStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }
        const projectId = req.params.id?.trim();
        const secretId  = req.params.secretId?.trim();

        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }
        if (!secretId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Secret ID is required" });
        }

        const project = await getUserProject({ userId, projectId })
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }

        const updatedKey = await updateKeyState({ projectId, secretId })
        if (!updatedKey) {
            return resFail({ res, code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to update secret" });
        }

        return resSuccess({
            res,
            code: HTTP_STATUS.OK,
            data: { secretName: updatedKey.secretName, isActive: updatedKey.isActive },
            message: "Secret state updated",
        });

    } catch (error) {
        next(error)
    }
}

export const removeApiKey = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({ res, code: HTTP_STATUS.UNAUTHORIZED, message: "User not found" })
        }

        const projectId = req.params.id?.trim();
        const secretId = req.params.secretId?.trim();

        if (!projectId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project ID is required" });
        }
        if (!secretId) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Secret ID is required" });
        }
        const project = await getUserProject({ userId, projectId })
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }
        const existingKey = await getSecretById({ projectId, secretId });
        if (!existingKey) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Secret not found" });
        }
        const deleted = await deleteProjectSecretKey({ projectId, secretId })
        if (!deleted) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Failed to delete secret" });
        }
        return resSuccess({
            res,
            code: HTTP_STATUS.OK,
            data: { name: deleted.secretName },
            message: "Secret removed",
        });

    } catch (error) {
        next(error)
    }
}