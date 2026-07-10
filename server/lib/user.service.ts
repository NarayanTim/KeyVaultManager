import { eq } from "drizzle-orm";
import db from "../config/db.ts";
import { users } from "../models/Users.model.ts";


export const getUserWithClerkID = async (clerkID: string) => {
    return await db.query.users.findFirst({
        where: eq(users.clerkId, clerkID),
    });
    
}

export const getUserWithID = async (userId: string) => {
    return await db.query.users.findFirst({
        where: eq(users.id, userId),
    });
}

export const createUser = async ({clerkID, name, email}:{clerkID:string, name?:string, email?:string}) => {
    const [user] = await db.insert(users).values({
        clerkId:clerkID,
        email,
        name
    }).returning();
    return user
}

export const createOrUpdate = async ({
  clerkId,
  name,
  email,
}: {
  clerkId: string;
  name?: string;
  email?: string;
}) => {
  const [user] = await db
    .insert(users)
    .values({
      clerkId,
      email,
      name,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        name,
        updatedAt: new Date(),
      },
    })
    .returning();

  return user;
};

export const deleteUser = async (clerkId:string) => {
    await db.delete(users).where(eq(users.clerkId, clerkId))
}