import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckout,
} from "../controller/checkout.controller.js";

const router = Router();

router.use(authUser);
router.post("/", authUser, createCheckout);
router.get("/:sessionId", authUser, checkoutSuccess);

export default router;
