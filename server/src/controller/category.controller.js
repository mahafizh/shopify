import { Category } from "../models/category.model.js";
import { AppSuccess } from "../utils/responseHandler.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().select("name");
    return AppSuccess(res, 200, categories);
  } catch (error) {
    next(error);
  }
};
