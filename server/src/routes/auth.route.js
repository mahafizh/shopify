import { Router } from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../controller/auth.controller.js";
const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.get("/refresh-token", refreshToken);

export default router;
