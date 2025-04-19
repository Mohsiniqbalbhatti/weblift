import Router from "express";
import {
  changeEmail,
  ChangePassword,
  contact,
  login,
  Logout,
  sendUser,
  signup,
} from "../controllers/user.js";
import { validateToken } from "../middleware/authMiddleware.js";
import { githubLogin } from "../utils/githubAuth.js";
import { connectGithub } from "../utils/connectGithub.js";

const router = new Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", Logout);
router.post("/github-login", githubLogin);
router.post("/connectGithub", validateToken, connectGithub);
router.post("/contact", contact);
router.post("/updatePassword", validateToken, ChangePassword);
router.post("/updateEmail", validateToken, changeEmail);
router.post("/contact", contact);

router.get("/", validateToken, sendUser);
export default router;
