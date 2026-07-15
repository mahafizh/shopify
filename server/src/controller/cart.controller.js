import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { AppError, AppSuccess } from "../utils/responseHandler.js";

export const getItemInCart = async (req, res, next) => {
  const user = req.user;
  try {
    if (user.cartItems.length === 0)
      return AppSuccess(res, 200, null, "Cart is empty");
    return AppSuccess(res, 200, user.cartItems);
  } catch (error) {
    next();
  }
};

export const addItemToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const user = req.user;
  try {
    const existingItem = user.cartItems.find((item) =>
      item.product.equals(productId),
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: quantity });
    }

    await user.save();
    return AppSuccess(res, 200, user.cartItems);
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const user = req.user;
  try {
    const product = user.cartItems.find((item) =>
      item.product.equals(productId),
    );
    if (!product) throw new AppError("Product not found in cart", 404);
    user.cartItems = user.cartItems.filter(
      (item) => !item.product.equals(productId),
    );
    await user.save();
    return AppSuccess(res, 200, user.cartItems);
  } catch (error) {
    next(error);
  }
};

export const updateItemInCart = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  try {
    const item = user.cartItems.find((item) => item.product.equals(productId));
    if (!item) throw new AppError("Product not found in cart", 404);

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1)
      throw new AppError("Quantity must be an integer greater than 0", 400);

    item.quantity = parsedQuantity;

    await user.save();
    return AppSuccess(res, 200, user.cartItems);
  } catch (error) {
    next(error);
  }
};
