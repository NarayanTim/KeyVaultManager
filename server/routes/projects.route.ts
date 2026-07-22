import { Router } from "express";
import { addProject, getProjects, getProject, updateProjectState, deleteProject, recreateProjectKey, getLatestProjects } from "../controllers/project.controller.ts";
import { protectRoute } from "../middlewares/auth.ts";


const router = Router();

router.use(protectRoute)
router.get("/all", getProjects)
router.post("/add-project", addProject)
router.get("/latest", getLatestProjects)
router.get("/get/:id", getProject);
router.patch("/update/:id", updateProjectState);


router.delete("/delete/:id", deleteProject);
router.post("/:id/key", recreateProjectKey);


export default router;