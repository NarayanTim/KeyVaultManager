import dotenv from "dotenv"

dotenv.config()

const fallbackPort: number = 4000;
const fallbackSalt:number = 10;


type ENVIRONMENT_SETUP = {
    DATABASE_URL?: string;
    PORT?: number;
    ENVIRONMENT?: 'DEVELOPMENT' | 'PRODUCTION';
    JWT_SECRET_KEY? : string;
    SALT_ROUNDS?: number;
    MASTER_ENCRYPTION_KEY?: string;

    UPSTASH_REDIS_REST_URL?:string;
    UPSTASH_REDIS_REST_TOKEN?:string;

    CLERK_PUBLISHABLE_KEY?: string;
    CLERK_SECRET_KEY?: string;
    CLERK_USER_WEBHOOK?: string;

}

const env : ENVIRONMENT_SETUP = {
    DATABASE_URL : process.env.DATABASE_URL || "",
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
    PORT : process.env.PORT ? Number(process.env.PORT) : fallbackPort,
    ENVIRONMENT : (process.env.ENVIRONMENT === 'PRODUCTION') ? 'PRODUCTION' : 'DEVELOPMENT',
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY,
    MASTER_ENCRYPTION_KEY : process.env.MASTER_ENCRYPTION_KEY,
    CLERK_USER_WEBHOOK : process.env.CLERK_USER_WEBHOOK,

}
// const env = ENV
export default env