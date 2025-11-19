import express from "express";
import { registerUser, loginUser } from "../controllers/auth-controller.js";

const router = express.Router();


router.post("/register", registerUser);
router.post('/Login', loginUser);

export default router;
