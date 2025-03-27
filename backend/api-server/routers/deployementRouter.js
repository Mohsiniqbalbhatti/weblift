import { Router } from "express";
import {
  deployment,
  getDeployementById,
  getDeploymentsByProjectId,
} from "../controllers/deployement.js";
import { validateToken } from "../middleware/authMiddleware.js";

const router = new Router();

router.post("/", validateToken, deployment);
router.get(
  "/getDeployments/:projectId",
  validateToken,
  getDeploymentsByProjectId
);
router.get("/deployment/:deploymentId", validateToken, getDeployementById);

export default router;
