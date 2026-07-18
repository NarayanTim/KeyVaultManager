import { z } from "zod"
import validator from "validator"


export const createSecretSchema = z.object({
    secretName: z.string().trim().min(1, "Secret Name").max(200, "Secret Name is too long"),
    encryptedValue: z.string().trim().min(1, "Key Value is required").min(1, "Key Value is too short"),
    isActive: z.preprocess(
        (value) => {
            if (typeof value === "boolean") return value;
            if (typeof value === "string") {
                if (value === "true") return true;
                if (value === "false") return false;
            }
            return value;
        },
        z.boolean().optional()
    ),
        
})


export const createProjectSchema = z.object({
    name: z.string().trim().min(5, "Project Name").max(200, "Project Name is too long").regex(
            /^(?=.*[a-zA-Z])[a-zA-Z0-9 _-]+$/,
            "Project name may only contain letters, numbers, spaces, hyphens, and underscores."
        ),
    isActive: z.preprocess(
        (value) => {
            if (typeof value === "boolean") return value;
            if (typeof value === "string") {
                if (value === "true") return true;
                if (value === "false") return false;
            }
            return value;
        },
        z.boolean().optional()
    ),
})


export type apiSecretForm = z.infer<typeof createSecretSchema>;
export type projectAddForm = z.infer<typeof createProjectSchema>;