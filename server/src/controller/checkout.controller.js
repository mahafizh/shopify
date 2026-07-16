import { stripe } from "../lib/stripe.js";
import { Coupon } from "../models/coupon.models.js";
import { CouponUsage } from "../models/couponUsage.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { createStripeCoupon } from "../utils/createStripeCoupon.js";
import { AppError, AppSuccess } from "../utils/responseHandler.js";

export const createCheckout = async (req, res, next) => {
  const { products, couponCode } = req.body;
  const user = req.user;
  try {
    if (!Array.isArray(products) || products.length === 0) {
      throw new AppError("Products is invalid or empty", 404);
    }

    const productIds = products.map((item) => item.productId);
    const dbProducts = await Product.find({
      _id: { $in: productIds },
    })
      .select("name price quantity stock imageURL")
      .lean();

    const productById = new Map(
      dbProducts.map((product) => [product._id.toString(), product]),
    );

    const checkoutItems = products.map((item) => {
      const product = productById.get(item.productId);
      if (!product) throw new AppError("Product not found", 404);

      if (Number(item.quantity) < 1)
        throw new AppError("Quantity is less than 1", 400);

      if (product.quantity < Number(item.quantity))
        throw new AppError(`Stock for ${product.name} is not enough`, 400);

      return {
        product,
        quantity: item.quantity,
        amount: Math.round(product.price * 100),
      };
    });

    const lineItems = checkoutItems.map(({ product, quantity, amount }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: product.imageURL ? [product.imageURL] : [],
        },
        unit_amount: amount,
      },
      quantity,
    }));

    let totalAmount = checkoutItems.reduce(
      (total, item) => total + item.amount * item.quantity,
      0,
    );

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
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
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100,
        );
      } else throw new AppError("Coupon is not found or invalid", 404);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(
                coupon.discountPercentage,
                coupon.usageLimit,
                coupon.expirationDate,
              ),
            },
          ]
        : [],
      metadata: {
        userId: user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          checkoutItems.map(({ product, quantity }) => ({
            id: product._id,
            quantity,
            price: product.price,
          })),
        ),
      },
    });

    if (session) {
      const products = JSON.parse(session.metadata.products);
      const order = await Order.create({
        userId: user._id,
        status: "pending",
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        payment: {
          method: session.payment_method_types[0],
          status: "pending",
        },
      });
      if (order) {
        return AppSuccess(res, 200, order);
      } else {
        throw new AppError("Failed to create order", 500);
      }
    } else {
      throw new AppError("Failed to create checkout session", 500);
    }
  } catch (error) {
    next(error);
  }
};

export const checkoutSuccess = async (req, res, next) => {
  const { sessionId } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "unpaid") {
      const userId = session.metadata.userId;
      if (session.metadata.couponCode) {
        const code = session.metadata.couponCode.trim().toUpperCase();

        // personal
        let coupon = await Coupon.findOneAndUpdate(
          {
            code,
            type: "personal",
            userId,
          },
          {
            $set: { isActive: false },
            $inc: { usageCount: 1 },
          },
          { new: true },
        );

        // if not personal try public
        if (!coupon) {
          coupon = await Coupon.findOneAndUpdate(
            {
              code,
              type: "public",
            },
            {
              $inc: { usageCount: 1 },
            },
            { new: true },
          );
        }

        if (coupon) {
          await CouponUsage.create({
            couponId: coupon._id,
            userId,
            stripeSessionId: session.id,
          });
        } else {
          // neither of those, then its invalid
          throw new AppError("Coupon is not found", 400);
        }
      }

      const order = await Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          $set: {
            status: "processing",
            "payment.status": "paid",
          },
        },
        { new: true },
      );

      if (order) {
        return AppSuccess(
          res,
          200,
          null,
          "Payment success and order will be processed",
        );
      } else {
        throw new AppError("Error while updating order status", 500);
      }
    } else {
      throw new AppError(
        "We are unable to process your order. Please make a payment",
        402,
      );
    }
  } catch (error) {
    next(error);
  }
};
