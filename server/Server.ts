import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import { ClerkUserWebhookHandler } from "./webhooks/Clerk.ts";
import env from "./config/env.ts";
import job from "./config/cron.ts";

import { clerkMiddleware } from '@clerk/express'
// import { userRoute, projectRoute, membershipRoute, secretRoute } from "./routes/index.ts";
import { userRoute, projectRoute} from "./routes/index.ts";

import { errorHandler } from "./middlewares/error.middleware.ts";


import fs from "node:fs";
import path from "node:path";



const app = express()
const PORT: number = env.PORT
console.log("Server file loaded");


const rawJson = express.raw({type: "application/json", limit : "1mb"})

app.post("/webhooks/user", rawJson, (req, res) => {
    void ClerkUserWebhookHandler(req, res)
})


app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin:['http://localhost:5000', 'http://localhost:5001', "http://localhost:5173"],
    credentials: true,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(clerkMiddleware())



app.use(cookieParser());

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});






app.use("/api/auth", userRoute)
app.use("/api/project", projectRoute)
// app.use("/api/secret", secretRoute)
// app.use("/api/membership", membershipRoute)
app.use(errorHandler)

const publicDirectory = path.join(process.cwd(), "public")
if (fs.existsSync(publicDirectory)) {
    app.use(express.static(publicDirectory))
    app.get("/{*any}", (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
            next();
            return;
        }

        if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
            next();
            return;
        }

        res.sendFile(path.join(publicDirectory, "index.html"), (err) => next(err));
    });
}


// const startServer = async ():Promise<void> => {
//     try {
//         console.log(`PostgreSQL connected successfully`);
//         app.listen(PORT, () => {
//             console.log(`Server is running on PORT = ${PORT}`);
//         });
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error("Error during server startup:", error.message);
//         } else {
//             console.error("Error during server startup:", error);
//         }
//         process.exit(1);
//     }
// }


// await startServer()

app.listen(PORT, () => {
    console.log(`Server is running on PORT = ${PORT}`)
    if (env.ENVIRONMENT === "PRODUCTION") {
        job.start()
    }

});