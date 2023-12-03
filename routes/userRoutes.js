import { Router } from "express";
import { login, logout, register } from "../controller/userController.js";

const router = Router();

router.route("/user/register").post(register);
router.route("/user/login").post(login);
router.route("/user/logout").post(logout);

export default router;
