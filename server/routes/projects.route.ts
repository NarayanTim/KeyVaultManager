import { Router } from "express";
import { addProject, getProjects, getProject, updateProjectState, deleteProject, recreateProjectKey } from "../controllers/project.controller.ts";
import { protectRoute } from "../middlewares/auth.ts";


const router = Router();

router.use(protectRoute)
router.get("/all", getProjects)
router.post("/add", addProject)
router.get("/:id", getProject);
router.patch("/:id", updateProjectState);
router.delete("/:id", deleteProject);
router.post("/:id/key", recreateProjectKey);
// router.get("/all", protectRoute, getProjects)
// router.post("/add", protectRoute, addProject)
// router.get("/:id", protectRoute, getProject);
// router.patch("/:id",protectRoute, updateProjectState);
// router.delete("/:id", protectRoute,deleteProject);
// router.post("/:id/key",protectRoute, recreateProjectKey);

export default router;