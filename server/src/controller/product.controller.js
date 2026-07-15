import { Product } from "../models/product.model.js";
import { AppSuccess } from "../utils/responseHandler.js";

export const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return AppSuccess(res, 200, "No products found");
    } else {
      return AppSuccess(res, 200, products);
    }
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  res.status(200).json("create product");
};
