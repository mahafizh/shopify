import { Router } from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import productRoutes from "./product.route.js";
import categoryRoutes from "./category.route.js";
import cartRoutes from "./cart.route.js";
import couponRoutes from "./coupon.route.js";
import checkoutRoutes from "./checkout.route.js";
import orderRoutes from "./order.route.js";
import analyticRoutes from "./analytic.route.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("API is running");
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/carts", cartRoutes);
router.use("/coupons", couponRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/analytics", analyticRoutes);

export default router;
