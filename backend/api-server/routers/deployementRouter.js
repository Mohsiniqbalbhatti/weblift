import { Router } from "express";
import {
  deployment,
  getDeploymentsByProjectId,
} from "../controllers/deployement.js";
import { validateToken } from "../middleware/authMiddleware.js";

const router = new Router();

router.post("/", validateToken, deployment);
router.get("/getDeployments/:projectId", getDeploymentsByProjectId);

export default router;
