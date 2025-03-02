import { Router } from "express";
import { newProject } from "../controllers/project.js";
import { validateToken } from "../middleware/authMiddleware.js";
const router = new Router();
router.post("/", validateToken, newProject);
export default router;
