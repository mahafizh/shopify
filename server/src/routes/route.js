import { Router } from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js"
import productRoutes from './product.route.js'

const router = Router();

router.get("/", (req, res) => {
  res.send("API is running")
});

router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/products", productRoutes)

export default router;
