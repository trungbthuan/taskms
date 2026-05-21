import express from "express";
import { testPage, register, login, getLogin, getRegister, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/register", register);
router.get("/register", getRegister);
router.post("/login", login);
router.get("/login", getLogin);
router.get("/logout", logout);

router.get("/test", authenticate, testPage);

export default router;
