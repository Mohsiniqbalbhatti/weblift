import { Router } from "express";
import { deployment } from "../controllers/deployement.js";

const router = new Router();

router.post("/", deployment);

export default router;
