import { Router } from "express";
import { getLogs } from "../controllers/getLogs.js";
import { validateToken } from "../middleware/authMiddleware.js";
const router = new Router();

router.get("/:deploymentId", getLogs);
export default router;
