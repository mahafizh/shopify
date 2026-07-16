import { stripe } from "../lib/stripe.js";
import { AppError } from "./responseHandler.js";

export const createStripeCoupon = async (
  discountPercentage,
  usageLimit,
  expirationDate,
) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
    max_redemptions: usageLimit,
    redeem_by: Math.floor(new Date(expirationDate).getTime() / 1000),
  });
  if (!coupon) throw new AppError("Request failed", 500);

  return coupon.id;
};
