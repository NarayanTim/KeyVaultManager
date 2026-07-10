
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, memberships, secrets, projectKeys, projects,  planEnum, subscriptionStatusEnum} from '../models/index.ts';
import env from './env.ts';



if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Please set it in your environment");
}


const sql = neon(env.DATABASE_URL);

const db = drizzle(sql, { schema: { users, memberships, secrets, projectKeys, projects,  planEnum, subscriptionStatusEnum } });

export default db;
