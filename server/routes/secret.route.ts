import { Router } from "express";
import {addAPIKey,getAllProjectKeys, removeApiKey, updateKeyStatus} from "../controllers/secret.controller.ts";
import { protectRoute } from "../middlewares/auth.ts";


const router = Router();

router.use(protectRoute)
router.get("/project/:id", getAllProjectKeys);
router.post("project/:id", addAPIKey);
router.patch("project/:id/:secretId", updateKeyStatus);
router.delete("project/:id/:secretId", removeApiKey);

export default router;