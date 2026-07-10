// import { and, eq } from "drizzle-orm";
// import { projects, secrets } from "../models";
// import db from "../config/db";
// import { encryptAPIKey } from "../utils/security";



// export const getSecretById = async ({projectId,secretId}: {projectId: string; secretId:  string}) => {
//     return db.query.secrets.findFirst({
//         where: and(eq(secrets.projectId, projectId), eq(secrets.id, secretId)),
//     });
// };


// export const addProjectAPIKey = async ({ userID, projectID, keyName, keyValue }: {userID: string;projectID: string;keyName: string;keyValue: string}) => {
//     const project = await db.query.projects.findFirst({
//         where:and(eq(projects.id, projectID), eq(projects.userId, userID))
//     })

//     if (!project) {
//         throw new Error("Project not found")
//     }

//     const hiddenValue = await encryptAPIKey(keyValue)

//     const [secret] = await db.insert(secrets).values({
//         projectId: project.id,
//         secretName: keyName,
//         encryptedValue: hiddenValue
//     }).returning()
//     return secret;


// }



// export const keyNameExist = async ({ projectId, secretName, }: { projectId: string; secretName: string }): Promise<boolean> => {
//     const secret = await db.query.secrets.findFirst({
//         where: and(
//             eq(secrets.projectId, projectId),
//             sql`LOWER(${secrets.secretName}) = LOWER(${secretName})`
//         ),
//         columns: { id: true },
//     });
//     return !!secret;


// }

// export const getAllSecretsKeys = async (projectId: string) => {
//     return db.query.secrets.findMany({
//         where: eq(secrets.projectId, projectId),
//         columns: {
//             id: true,
//             secretName: true,
//             isActive: true,
//             createdAt: true,
//             updatedAt: true,
//         },
//         orderBy:(s, {desc}) => [desc(s.createdAt)]
//     })
// }


// export const updateKeyState = async ({ projectId, secretId }: { projectId: string, secretId: string }) => {
//     const secret = await db.query.secrets.findFirst({
//         where: and(eq(secrets.id, secretId), eq(secrets.projectId, projectId)),
//     });

//     if (!secret) return null;

//     const [updated] = await db.update(secrets).set({ isActive: !secret.isActive, updatedAt: new Date() }).where(and(eq(secrets.id, secretId), eq(secrets.projectId, projectId))).returning();

//     return updated;


// }


// export const deleteProjectSecretKey = async ({projectId,secretId,}: {projectId: string;secretId:  string}) => {
//     const [deleted] = await db.delete(secrets).where(and(eq(secrets.projectId, projectId), eq(secrets.id, secretId))).returning();
//     return deleted
// }