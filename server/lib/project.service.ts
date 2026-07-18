import { and, eq, sql } from "drizzle-orm";
import db from "../config/db.ts";
import { projects } from "../models/Project.model.ts";
import { projectKeys } from "../models/ProjectKey.model.ts";
import { createAPIKey, hashAPIKey } from "../utils/security.ts";


export class ProjectNameExistsError extends Error {
    constructor() {
        super("Project name already exists");
        this.name = "ProjectNameExistsError";
    }
}


const PG_UNIQUE_VIOLATION = "23505";
type UserId = string;
type ProjectId = string;

interface NewProjectInput{
    name: string;
    userId: UserId;
    isActive?: boolean;
}

interface NewProjectResult{
    id: string;
    name: string;
    key: string;
    hashKey: string;

}

interface RotatedKeyResult {
    keyHash: string;
    plainKey: string;
}

type ProjectListItem = Pick<Project, "id" | "name" | "isActive" | "createdAt">;

export const getUserProjects = async (userId: UserId, filterKey?: boolean): Promise<ProjectListItem[]> => {
    return await db.query.projects.findMany({
        columns: {
            name: true,
            isActive: true,
            id: true,
            createdAt: true,
        },
        where: filterKey ? and(eq(projects.userId, userId), eq(projects.isActive, true)) : eq(projects.userId, userId),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
    });
};

export const getUserProject = async (userId:UserId, projectId:ProjectId):Promise<Project | undefined> => {
    return await db.query.projects.findFirst({
        where: and(
            eq(projects.userId, userId),
            eq(projects.id, projectId),
        )
    })
}


export const addNewProject = async ({name,userId,isActive}: NewProjectInput): Promise<NewProjectResult> => {
    try {
        return await db.transaction(async (tx) => {
            const [newProject] = await tx
                .insert(projects)
                .values({
                    name,
                    userId,
                    isActive: isActive ?? true,
                })
                .returning();

            if (!newProject) {
                throw new Error("Failed to create project");
            }

            const apiKey = await createAPIKey();
            const keyHash = await hashAPIKey(apiKey);

            const [projectKey] = await tx.insert(projectKeys).values({projectId: newProject.id,keyHash}).returning();

            if (!projectKey) {
                throw new Error("Failed to create project key");
            }

            return {
                id: newProject.id,
                name: newProject.name,
                key: apiKey,
                hashKey: projectKey.keyHash,
            };
        });
    } catch (error: any) {
        if (error?.code === PG_UNIQUE_VIOLATION) {
            // throw new Error("ProjectNameExistsError");
            throw new ProjectNameExistsError();
        }
        throw error;
    }
};












// export const addNewProject = async ({name, userId, isActive}:NewProjectInput) : Promise<NewProjectResult> =>{
    
//     const [newProject] = await db.insert(projects).values({
//         name,
//         userId,
//         isActive: isActive ?? true,
//     }).returning();

//     if (!newProject) {
//         throw new Error("Failed to create project");
//     }


//     const apiKey = await createAPIKey()
//     const keyHash  = await hashAPIKey(apiKey)
//     const [projectKey] = await db.insert(projectKeys).values({
//         projectId:newProject?.id,
//         keyHash,
//     }).returning()

//     return {
//         id:newProject.id,
//         name:newProject.name,
//         key:apiKey,
//         hashKey:projectKey?.keyHash
//     }
// }


// Create new project key

export const generateNewProjectKey = async (projectId:ProjectId):Promise<RotatedKeyResult | null> => {
    const existing = await db.query.projectKeys.findFirst({
        where: eq(projectKeys.projectId, projectId),
    })

    if (!existing) return null;

    const newKey = await createAPIKey();
    const newKeyHash = await hashAPIKey(newKey)
    
    const [updateKey] = await db
        .update(projectKeys)
        .set({keyHash: newKeyHash,lastUsedAt:null,})
        .where(eq(projectKeys.projectId, projectId))
        .returning();
    
    if(!updateKey) return null

    return {
        keyHash: updateKey.keyHash,
        plainKey:newKey,
    };
}


// ─── Toggle Active ────────────────────────────────────────────────────────────

export const updateState = async ({ projectId, userId }: { projectId: ProjectId; userId: UserId }): Promise<Project | null> => {
    const existing = await db.query.projects.findFirst({
        where: and(
            eq(projects.id, projectId),
            eq(projects.userId, userId)
        ),
    });

    if (!existing) return null;

    const [updated] = await db
        .update(projects).set({isActive:  !existing.isActive,updatedAt: new Date()}).where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
        .returning();

    return updated ?? null;
};

export const deleteUserProject = async ({ userId, projectId }: { userId: UserId; projectId: ProjectId }):Promise<Project | null> => {
    const [deleted] = await db.delete(projects).where(and(eq(projects.userId, userId), eq(projects.id, projectId))).returning();
    return deleted ?? null;
}