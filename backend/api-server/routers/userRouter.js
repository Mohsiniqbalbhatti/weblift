import Router from "express";
import { login, Logout, sendUser, signup } from "../controllers/user.js";
import { validateToken } from "../middleware/authMiddleware.js";
import { githubLogin } from "../utils/githubAuth.js";

const router = new Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", Logout);
router.post("/github-login", githubLogin);

router.get("/", validateToken, sendUser);
export default router;
