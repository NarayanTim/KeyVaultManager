import { and, eq, inArray } from "drizzle-orm";
import db from "../config/db.ts";
import { encryptAPIKey } from "../utils/security.ts";
import { projects, secrets } from "../models/index.ts";



export const saveAllProjectSecrets = async ({
  projectId,
  variables,
}: {
  projectId: string;
  variables: { key: string; value: string; isActive?: boolean }[];
}) => {
  const existing = await db.query.secrets.findMany({
    where: eq(secrets.projectId, projectId),
  });

  const existingByKey = new Map(
    existing.map((s) => [s.key.toLowerCase(), s])
  );

  const incomingKeys = new Set(
    variables.map((v) => v.key.toLowerCase())
  );

  const toCreate = variables.filter(
    (v) => !existingByKey.has(v.key.toLowerCase())
  );

  const toUpdate = variables.filter(
    (v) => existingByKey.has(v.key.toLowerCase())
  );

  const toDeleteIds = existing
    .filter((s) => !incomingKeys.has(s.key.toLowerCase()))
    .map((s) => s.id);

  // Delete removed secrets
  if (toDeleteIds.length > 0) {
    await db
      .delete(secrets)
      .where(
        and(
          eq(secrets.projectId, projectId),
          inArray(secrets.id, toDeleteIds)
        )
      );
  }

  // Update existing secrets
  for (const v of toUpdate) {
    const existingRow = existingByKey.get(v.key.toLowerCase())!;
    const encryptedValue = await encryptAPIKey(v.value);

    await db
      .update(secrets)
      .set({
        value: encryptedValue,
        isActive: v.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(secrets.id, existingRow.id),
          eq(secrets.projectId, projectId)
        )
      );
  }

  // Insert new secrets
  if (toCreate.length > 0) {
    const rows = await Promise.all(
      toCreate.map(async (v) => ({
        projectId,
        key: v.key,
        value: await encryptAPIKey(v.value),
        isActive: v.isActive ?? true,
      }))
    );

    await db.insert(secrets).values(rows);
  }

  return db.query.secrets.findMany({
    where: eq(secrets.projectId, projectId),
    columns: {
      id: true,
      key: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: (s, { desc }) => [desc(s.createdAt)],
  });
};

export const getSecretById = async ({projectId,secretId}: {projectId: string; secretId:  string}): Promise<Secret | undefined> => {
    return await db.query.secrets.findFirst({
        where: and(eq(secrets.projectId, projectId), eq(secrets.id, secretId)),
    });
};


export const addProjectAPIKey = async ({ userID, projectID, keyName, keyValue }: {userID: string;projectID: string;keyName: string;keyValue: string}):Promise<Secret> => {
    const project = await db.query.projects.findFirst({
        where:and(eq(projects.id, projectID), eq(projects.userId, userID))
    })

    if (!project) {
        throw new Error("Project not found")
    }

    const hiddenValue = await encryptAPIKey(keyValue)

    const [secret] = await db.insert(secrets).values({
        projectId: project.id,
        key: keyName,
        value: hiddenValue
    }).returning()

    if (!secret) {
        throw new Error("Failed to create secret");
    }

    return secret;


}



export const keyNameExist = async ({ projectId, key, }: { projectId: string; key: string }): Promise<boolean> => {
    const secret = await db.query.secrets.findFirst({
        where: and(
            eq(secrets.projectId, projectId),
            sql`LOWER(${secrets.key}) = LOWER(${key})`
        ),
        columns: { id: true },
    });
    return !!secret;


}

export const getAllSecretsKeys = async (projectId: string) => {
    return await db.query.secrets.findMany({
        where: eq(secrets.projectId, projectId),
        columns: {
            id: true,
            key: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy:(s, {desc}) => [desc(s.createdAt)]
    })
}


export const updateKeyState = async ({ projectId, secretId }: { projectId: string, secretId: string }):Promise<Secret | null> => {
    const secret = await db.query.secrets.findFirst({
        where: and(eq(secrets.id, secretId), eq(secrets.projectId, projectId)),
    });

    if (!secret) return null;

    const [updated] = await db.update(secrets).set({ isActive: !secret.isActive, updatedAt: new Date() }).where(and(eq(secrets.id, secretId), eq(secrets.projectId, projectId))).returning();

    return updated ?? null;


}


export const deleteProjectSecretKey = async ({projectId,secretId,}: {projectId: string;secretId:string}) : Promise<Secret | null> => {
    const [deleted] = await db.delete(secrets).where(and(eq(secrets.projectId, projectId), eq(secrets.id, secretId))).returning();
    return deleted ?? null
}