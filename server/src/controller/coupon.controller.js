import { randomInt } from "crypto";
import { Coupon } from "../models/coupon.models.js";
import { AppError, AppSuccess } from "../utils/responseHandler.js";

// admin required
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().lean();
    console.log(coupons);
    if (coupons.length === 0) return AppSuccess(res, 200, [], "Data empty");
    return AppSuccess(res, 200, coupons);
  } catch (error) {
    next();
  }
};

// authenticated user
export const getAvailableCoupons = async (req, res, next) => {
  const user = req.user;
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expirationDate: { $gt: new Date() },
      $expr: { $lt: ["$usageCount", "$usageLimit"] },
      $or: [
        { type: "public" },
        {
          type: "personal",
          userId: user._id,
        },
      ],
    }).lean();
    if (coupons.length === 0) return AppSuccess(res, 200, [], "Data empty");
    return AppSuccess(res, 200, coupons);
  } catch (error) {
    next(error);
  }
};

export const validateCoupon = async (req, res, next) => {
  const { code } = req.params;
  const user = req.user;
  try {
    const coupon = await Coupon.findOne({
      code: code,
      $or: [
        { type: "public" },
        {
          type: "personal",
          userId: user._id,
        },
      ],
      isActive: true,
      expirationDate: { $gt: new Date() },
      $expr: { $lt: ["$usageCount", "$usageLimit"] },
    });
    if (!coupon) throw new AppError("Coupon is not found or invalid", 404);
    return AppSuccess(res, 200, {
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    next(error);
  }
};

export const generateCoupon = async (req, res, next) => {
  const { code, type, userId, discountPercentage, expirationDate, usageLimit } =
    req.body;
  try {
    let generatedCode = code?.trim().toUpperCase();
    if (code === undefined) {
      generatedCode = "";
      const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      for (let i = 0; i < 8; i++) {
        generatedCode += characters[randomInt(characters.length)];
      }
    }

    const formattedExpDate = new Date(`${expirationDate}T23:59:00+07:00`);

    const couponData = {
      code: generatedCode,
      type,
      discountPercentage,
      expirationDate: formattedExpDate,
      usageLimit,
    };

    if (type === "personal") {
      if (!userId) throw new AppError("userId is required for personal coupon");
      couponData.userId = userId;
    }
    const coupon = await Coupon.create(couponData);
    return AppSuccess(res, 201, couponData);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new AppError("Coupon not found", 404);
    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};
