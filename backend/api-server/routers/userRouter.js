import Router from "express";
import { login, sendUser, signup } from "../controllers/user.js";
import { validateToken } from "../middleware/authMiddleware.js";

const router = new Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/", validateToken, sendUser);
export default router;
