import { Router } from "express";
import {
  generateCoupon,
  getAllCoupons,
  getAvailableCoupons,
  validateCoupon,
  deleteCoupon,
} from "../controller/coupon.controller.js";
import { authUser, isAdmin } from "../middleware/auth.middleware.js";
const router = Router();

router.use(authUser);
router.get("/", isAdmin, getAllCoupons);
router.delete("/:id", isAdmin, deleteCoupon);
router.get("/available", getAvailableCoupons);
router.get("/validate/:code", validateCoupon);
router.post("/generate", isAdmin, generateCoupon);

export default router;
