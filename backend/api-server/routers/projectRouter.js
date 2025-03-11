import { Router } from "express";
import {
  checkName,
  getProjectById,
  newProject,
  sendProjects,
} from "../controllers/project.js";
import { validateToken } from "../middleware/authMiddleware.js";
const router = new Router();
router.post("/", validateToken, newProject);
router.get("/", validateToken, sendProjects);
router.post("/checkName", validateToken, checkName);
router.get("/:projectId", validateToken, getProjectById);
export default router;
