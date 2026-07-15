import { Router } from "express";
import {
  getAllProduct,
  getFeaturedProduct,
  getRecommendationProduct,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controller/product.controller.js";
import { authUser, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getAllProduct);
router.post("/", authUser, isAdmin, createProduct);
router.delete("/:id", authUser, isAdmin, deleteProduct);
router.patch("/:id", authUser, isAdmin, updateProduct);

router.get("/featured", getFeaturedProduct);
router.get("/recommendation", getRecommendationProduct);

export default router;
