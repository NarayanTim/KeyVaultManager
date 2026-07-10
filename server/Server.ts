import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import { ClerkUserWebhookHandler } from "./webhooks/Clerk.ts";
// import ENV from "./config/env";
import env from "./config/env";
import { clerkMiddleware } from '@clerk/express'
import { userRoute, projectRoute, membershipRoute, secretRoute } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";


const app = express()
const PORT: number = env.PORT
console.log("Server file loaded");


const rawJson = express.raw({type: "application/json", limit : "1mb"})

app.post("/webhook/user", rawJson, (req, res) => {
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

app.get("/test", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

app.get("/", (req, res) => {
    res.send("Server working");
    console.log("REQUEST:", req.method, req.url);
});




app.use("/api/auth", userRoute)
app.use("/api/projects", projectRoute)
app.use("/api/secret", secretRoute)
app.use("/api/membership", membershipRoute)

app.use(errorHandler)


const startServer = async ():Promise<void> => {
    try {
        console.log(`PostgreSQL connected successfully`);
        app.listen(PORT, () => {
            console.log(`Server is running on PORT = ${PORT}`);
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error during server startup:", error.message);
        } else {
            console.error("Error during server startup:", error);
        }
        process.exit(1);
    }
}


await startServer()