import { Router } from "express";
import {addAPIKey,getAllProjectKeys, removeApiKey, saveAllChange, updateKeyStatus, getKeyRealValue} from "../controllers/secret.controller.ts";
import { protectRoute } from "../middlewares/auth.ts";


const router = Router();

router.use(protectRoute)
router.get("/project/allKeys/:id", getAllProjectKeys);
router.post("project/:id", addAPIKey);
router.patch("project/:id/:secretId", updateKeyStatus);

router.get("key-value/:id/:projectId", getKeyRealValue);

router.patch("project/:id/all", saveAllChange);
router.delete("project/:id/:secretId", removeApiKey);



export default router;