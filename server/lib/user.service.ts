import { eq } from "drizzle-orm";
import db from "../config/db";
import { users } from "../models/Users.model.ts";


export const getUserWithClerkID = async (clerkID: string) => {
    return await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });
    
}

export const getUserWithID = async (userId: string) => {
    return await db.query.users.findFirst({
        where: eq(users.id, userId),
    });
}

export const createUser = async ({clerkID, name, email}:{clerkID:string, name?:string, email?:string}) => {
    const [user] = await db.insert(users).values({
        clerkId,
        email,
        name
    }).returning();
    return user
}

export const createOrUpdate = async({ clerkID, name, email }: { clerkID: string, name?: string, email?: string }) => {
    const [user] = await db.insert(users).values({
        clerkId,
        email,
        name
    }).onConflictDoUpdate({
        target: clerkID,
        set:{email, name, updatedAt: new Date()}
    })
}

export const deleteUser = async (clerkId) => {
    await db.delete(users).where(eq(users.clerkId, clerkId))
}