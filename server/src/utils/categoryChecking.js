import { Category } from "../models/category.model.js";
import { AppError } from "./responseHandler.js";

export const categoryChecking = async (categories) => {
  if (categories === undefined) return undefined;

  let formattedCategories = categories;

  if (!Array.isArray(formattedCategories)) {
    formattedCategories = [formattedCategories];
  }

  if (formattedCategories.length === 0) {
    throw new AppError("Categories can't be empty", 400);
  }

  const categoriesExists = await Category.find({
    _id: { $in: formattedCategories },
  });

  if (categoriesExists.length !== formattedCategories.length) {
    throw new AppError("One or more genres are not valid", 400);
  }

  return formattedCategories;
};
