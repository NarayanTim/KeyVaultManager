
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { users, memberships, secrets, projectKeys, projects,  planEnum, subscriptionStatusEnum} from '../models/index';
import ENV from './env';



if (!ENV.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing. Please set it in your environment");
}


const sql = neon(ENV.DATABASE_URL);

const db = drizzle(sql, { schema: { users, memberships, secrets, projectKeys, projects,  planEnum, subscriptionStatusEnum } });

export default db;
