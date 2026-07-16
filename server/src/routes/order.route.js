import { Router } from "express";
import { authUser, isAdmin } from "../middleware/auth.middleware.js";
import { getAllOrder, getYourOrder } from "../controller/order.controller.js";

const router = Router();

router.get("/", authUser, getYourOrder);
router.get("/all", authUser, isAdmin, getAllOrder);

export default router;
