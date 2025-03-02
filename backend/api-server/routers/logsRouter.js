import { Router } from "express";
import { getLogs } from "../controllers/getLogs.js";
import { validateToken } from "../middleware/authMiddleware.js";
const router = new Router();

router.post("/", validateToken, getLogs);
export default router;
