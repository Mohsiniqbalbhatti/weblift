import Router from "express"
import { signup } from "../controllers/user.js";

const router = new Router();

router.post("/signup", signup);
export default router
