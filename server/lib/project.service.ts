// import { and, eq, sql } from "drizzle-orm";
// import db from "../config/db";
// import { projects } from "../models/Project.model";
// import { projectKeys } from "../models/ProjectKey.model";
// // import { createAPIKey, hashAPIKey } from "../utils/security";

// // Check Safe

// // export const getUserProjects = async ({userId,filterKey,}: {userId: string;filterKey?: boolean}) => {
// export const getUserProjects = async (userId: string, filterKey?: boolean) => {
//     return await db.query.projects.findMany({
//         columns: {
//             name: true,
//             isActive: true,
//             id: true,
//             createdAt: true,
//         },
//         // filterKey was previously accepted but unused — wired in here as
//         // "only return active projects when true". Adjust if you meant
//         // something else (e.g. only projects that HAVE a key row).
//         where: filterKey ? and(eq(projects.userId, userId), eq(projects.isActive, true)) : eq(projects.userId, userId),
//         orderBy: (projects, { desc }) => [desc(projects.createdAt)],
//     });
// };

// export const getUserProject = async (userId, projectId) => {
//     return await db.query.projects.findFirst({
//         where: and(
//             eq(projects.userId, userId),
//             eq(projects.id, projectId),
//         )
//     })
// }

// export const addNewProject = async ({name, userId, isActive}:{name:string, userId:string, isActive?:boolean}) => {
    
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


// // Create new project key

// export const generateNewProjectKey = async ({ projectId }: { projectId: string; }) => {
//     const existing = db.query.projectKeys.findFirst({
//         where: eq(projectKeys.projectId, projectId),
//     })

//     if (!existing) return null;

//     const newKey = await createAPIKey();
//     const newKeyHash = await hashAPIKey(newKey)
    
//     const [updateKey] = await db
//         .update(projectKeys)
//         .set({keyHash: newKeyHash,lastUsedAt:null,})
//         .where(eq(projectKeys.projectId, projectId))
//         .returning();
    
//     if(!updateKey) return null

//     return {
//         keyHash: updateKey.keyHash,
//         plainKey:newKey,
//     };
// }


// // ─── Toggle Active ────────────────────────────────────────────────────────────

// export const updateState = async ({ projectId, userId }: { projectId: string; userId: string }) => {
//     const existing = await db.query.projects.findFirst({
//         where: and(
//             eq(projects.id, projectId),
//             eq(projects.userId, userId)
//         ),
//     });

//     if (!existing) return null;

//     const [updated] = await db
//         .update(projects).set({isActive:  !existing.isActive,updatedAt: new Date()}).where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
//         .returning();

//     return updated;
// };

// export const deleteUserProject = async ({ userId, projectId }: { userId: string; projectId: string }) => {
//     const [deleted] = await db.delete(projects).where(and(eq(projects.userId, userId), eq(projects.id, projectId))).returning();
//     return deleted;
// }