import { Router } from "express";
import { deployment } from "../controllers/deployement.js";
import { validateToken } from "../middleware/authMiddleware.js";

const router = new Router();

router.post("/", validateToken, deployment);

export default router;
