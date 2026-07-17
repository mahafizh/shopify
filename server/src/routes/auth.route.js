import { Router } from "express";
import {
  forgotPassword,
  refreshToken,
  requestVerifyEmail,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyEmail,
} from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.get("/refresh-token", refreshToken);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/request-verify-email",authUser, requestVerifyEmail);

export default router;
