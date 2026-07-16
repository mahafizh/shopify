import { Order } from "../models/order.model.js";
import { AppSuccess } from "../utils/responseHandler.js";

export const getYourOrder = async (req, res, next) => {
  const user = req.user;
  const { payment_status, payment_method, order_status } = req.query;
  try {
    const filter = {
      userId: user._id,
    };

    if (payment_status) {
      filter["payment.status"] = payment_status;
    }

    if (payment_method) {
      filter["payment.method"] = payment_method;
    }

    if (order_status) {
      filter["status"] = order_status;
    }

    const order = await Order.find(filter)
      .select("products status totalAmount payment createdAt")
      .populate({ path: "products.product", select: "name price imageURL" })
      .sort({ createdAt: -1 })
      .lean();
    if (order.length >= 1) {
      return AppSuccess(res, 200, order);
    } else {
      return AppSuccess(res, 200, null, "Order empty");
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOrder = async (req, res, next) => {
  try {
    const order = await Order.find()
      .select("products status totalAmount payment createdAt")
      .populate({ path: "products.product", select: "name price imageURL" })
      .sort({ createdAt: -1 })
      .lean();
    if (order.length >= 1) {
      return AppSuccess(res, 200, order);
    } else {
      return AppSuccess(res, 200, null, "Order empty");
    }
  } catch (error) {
    next(error);
  }
};
