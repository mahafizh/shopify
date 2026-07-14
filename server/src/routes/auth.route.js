import { Router } from "express";
import {
  getMe,
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../controller/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);
router.get("/refresh-token", refreshToken);
router.get("/me", authUser, getMe
  
);

export default router;
