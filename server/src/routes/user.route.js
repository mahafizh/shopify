import { Router } from "express";
import { authUser, isAdmin } from "../middleware/auth.middleware.js";
import {
  deleteUser,
  getMe,
  updatePassword,
  updateUser,
} from "../controller/user.controller.js";
const router = Router();

router.patch("/", authUser, updateUser);
router.delete("/", authUser, deleteUser);
router.patch("/update-password", authUser, updatePassword);
router.get("/me", authUser, getMe);

export default router;
