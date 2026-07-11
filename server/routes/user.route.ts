import { Router } from "express";
import { protectRoute } from "../middlewares/auth.ts";
import { getProfile } from "../controllers/user.controller.ts";



const router = Router();
router.get("/profile", protectRoute, getProfile)


export default router;