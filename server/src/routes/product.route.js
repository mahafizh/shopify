import { Router } from "express";
import { getAllProduct, createProduct } from "../controller/product.controller.js";
import { authUser, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllProduct);
router.post("/", authUser, isAdmin, createProduct);

export default router;
