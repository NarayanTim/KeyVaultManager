import type { AuthRequest } from "../middlewares/auth.ts"
import type { Response, Request, NextFunction } from "express"
import {resZodIssue, errorMessage, HTTP_STATUS, resFail, resSuccess } from "../utils/res.ts"
import { getUserProject } from "../lib/project.service.ts"
import { addProjectAPIKey, deleteProjectSecretKey, getAllSecretsKeys, getSecretById, keyNameExist, saveAllProjectSecrets, updateKeyState } from "../lib/secret.service.ts"
import { createSecretSchema, type KEY_INPUT } from "../forms/forms.ts"
import { HTTP_STATUS } from './../utils/res';



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

        const { key, value } = result.data;
        const alreadyExists = await keyNameExist({ projectId, key });
        if (alreadyExists) {
            return resFail({ res, code: HTTP_STATUS.CONFLICT, message: "Secret name already exists in this project" });
        }

        const newAPIKey = await addProjectAPIKey({ userID, projectID, keyName:key, keyValue:value })
        if (!newAPIKey) {
            return resFail({ res, code: HTTP_STATUS.INTERNAL_SERVER_ERROR, message: "Failed to create secret" });
        }
        return resSuccess({
            res, code: HTTP_STATUS.CREATED,
            data: {
                id: newAPIKey.id,
                key : newAPIKey.key,
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
        const allKeys = await getAllSecretsKeys(projectId)
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

        const project = await getUserProject( userId, projectId)
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
            data: { key: updatedKey.key, isActive: updatedKey.isActive },
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
        const project = await getUserProject(userId, projectId)
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
            data: { key: deleted.key },
            message: "Secret removed",
        });

    } catch (error) {
        next(error)
    }
}


export const getKeyRealValue = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.userID
        if (!userId) {
            return resFail({res, code:HTTP_STATUS.UNAUTHORIZED, message:"User not found"})
        }

        const projectId = req.params.id?.trim();
        const id = req.params.id?.trim();
        if (!projectId || !id) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Project or secrete ID is required" });
        }

        const project = await getUserProject(userId, projectId)
        if (!project) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "Project not found" });
        }
        
        // get the project secrete with id
        const keyValue = await getSecretById({ projectId: projectId, secretId: id })
        if (!keyValue) {
            return resFail({ res, code: HTTP_STATUS.NOT_FOUND, message: "API KEY not found" });
        }
        return resSuccess({res, code:HTTP_STATUS.OK, data:{value:keyValue.value}, message:"The value has been found"})
        
    } catch (error) {
        nextTick(error)
    }
}


/* PUT /projects/:projectId/secrets*/
export const saveAllChange = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
        
        const receivedInput = req.body
        console.log("Input Check: ", receivedInput)
        console.log("Input Check 2 : ", JSON.stringify(receivedInput, null, 2))
        if (!Array.isArray(receivedInput)) {
            return resFail({ res, code: HTTP_STATUS.BAD_REQUEST, message: "Expected an array of variables" });
        }

        const seen = new Set<string>()
        const validated: KEY_INPUT[] = []

        for (const v of receivedInput) {
            const result = createSecretSchema.safeParse(v);
            if (!result.success) {
                return resFail({
                    res,
                    code: HTTP_STATUS.BAD_REQUEST,
                    message: resZodIssue(result.error.issues),
                });
            }
            const lower = result.data.key.toLocaleLowerCase()
            if (seen.has(lower)) {
                return resFail({
                    res,
                    code: HTTP_STATUS.BAD_REQUEST,
                    message:`Duplicate key: "${v.key}"`,
                });
            }
            seen.add(lower)
            validated.push(result.data)
        }
        const updatedKeys = await saveAllProjectSecrets({ projectId, variables: validated })
        return resSuccess({
            res,
            code: HTTP_STATUS.OK,
            data: { keys: updatedKeys },
            message: "Changes saved",
        });        
    } catch (error) {
        next(error)
    }
}