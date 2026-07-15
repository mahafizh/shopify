import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {
  addItemToCart,
  getItemInCart,
  updateItemInCart,
  removeItemFromCart,
} from "../controller/cart.controller.js";
const router = Router();

router.get("/", authUser, getItemInCart);
router.post("/", authUser, addItemToCart);
router.patch("/:productId", authUser, updateItemInCart);
router.delete("/:productId", authUser, removeItemFromCart);

export default router;
