import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
    payment: {
      method: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
      },
    },
    shipping: {
      awb: {
        type: String,
        required: function () {
          return ["shipped", "delivered"].includes(this.status);
        },
      },
      operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShippingOperator",
        required: function () {
          return ["shipped", "delivered"].includes(this.status);
        },
      },
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
