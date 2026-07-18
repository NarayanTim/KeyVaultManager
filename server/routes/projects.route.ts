import { Router } from "express";
import { addProject, getProjects, getProject, updateProjectState, deleteProject, recreateProjectKey } from "../controllers/project.controller.ts";
import { protectRoute } from "../middlewares/auth.ts";


const router = Router();

router.use(protectRoute)
router.get("/all", getProjects)
router.post("/add-project", addProject)
router.get("/:id", getProject);
router.patch("/:id", updateProjectState);
router.delete("/:id", deleteProject);
router.post("/:id/key", recreateProjectKey);


export default router;