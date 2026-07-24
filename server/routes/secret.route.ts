import { Router } from "express";
import {addAPIKey,getAllProjectKeys, removeApiKey, saveAllChange, updateKeyStatus} from "../controllers/secret.controller.ts";
import { protectRoute } from "../middlewares/auth.ts";


const router = Router();

router.use(protectRoute)
router.get("/project/:id", getAllProjectKeys);
router.post("project/:id", addAPIKey);
router.patch("project/:id/:secretId", updateKeyStatus);
router.patch("project/:id/all", saveAllChange);
router.delete("project/:id/:secretId", removeApiKey);



export default router;