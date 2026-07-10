import type { Request, Response } from "express";
import env from "../config/env.ts";
import { resFail, HTTP_STATUS, resSuccess } from "../utils/res.ts";
import { verifyWebhook } from "@clerk/express/webhooks";
import { createOrUpdate, deleteUser } from "../lib/user.service.ts";

export async function ClerkUserWebhookHandler(req:Request, res:Response) {
    try {
        if (!env.CLERK_USER_WEBHOOK) {
            return resFail({res, code:HTTP_STATUS.SERVICE_UNAVAILABLE, message:"Webhook secret is not provide"})
        }
        const payload = req.body instanceof Buffer ? req.body.toString("utf-8") : String(req.body)
        // const request = new Request("http://internal/webhooks/clerk", {
        //     method: "POST",
        //     headers: new Headers(req.headers as Record<string, string>),
        //     body:payload
        // })

        // const request = new Request("http://internal/webhooks/clerk", {
        //     method: "POST",
        //     headers: new Headers(req.headers as HeadersInit),
        //     body: payload,
        // });

        // const event = await verifyWebhook(request, { signingSecret: env.CLERK_USER_WEBHOOK })
        const event = await verifyWebhook(req, { signingSecret: env.CLERK_USER_WEBHOOK })
        if (event.type === "user.created" || event.type === "user.updated") {
            const user = event.data;
            const email = user.email_addresses.find((e) =>e.id === user.primary_email_address_id)?.email_address ??user.email_addresses?.[0]?.email_address ??undefined;
            const displayName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || undefined;

            await createOrUpdate({
                clerkId: user.id,
                email: email,
                name:displayName,
            })
        }

        if (event.type === "user.deleted") {
            const id = event.data.id
            if (id) {
                await deleteUser(id)
            }
        }
        
        resSuccess({res, code:HTTP_STATUS.OK, message:"Event completed"})
    } catch (error) {
        console.error("Clerk webhook error: ", error)
        res.status(HTTP_STATUS.NOT_FOUND).json({error : "Invalid webhook"})
    }
}