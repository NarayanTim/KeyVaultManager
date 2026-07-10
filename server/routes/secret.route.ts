// import { Router } from "express";
// import {addAPIKey,getAllProjectKeys, removeApiKey, updateKeyStatus} from "../controllers/secret.controller";
// import { protectRoute } from "../middlewares/auth";


// const router = Router();


// router.get("/", protectRoute, getAllProjectKeys);
// router.post("project/:id", protectRoute, addAPIKey);

// // PATCH  /api/projects/:id/secrets/:secretId     — toggle isActive on/off
// router.patch("project/:id/:secretId",protectRoute, updateKeyStatus);

// // DELETE /api/projects/:id/secrets/:secretId     — delete a secret
// router.delete("project/:id/:secretId",protectRoute, removeApiKey);

// export default router;