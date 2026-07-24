import { z } from "zod"
import validator from "validator"


export const createSecretSchema = z.object({
    key: z.string().trim().min(1, "Secret Name").max(200, "Secret Name is too long"),
    value: z.string(),
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


export type KEY_INPUT = z.infer<typeof createSecretSchema>;
export type projectAddForm = z.infer<typeof createProjectSchema>;