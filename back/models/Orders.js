import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order: { type: [String], required: true },
    date: { type: Date, required: true },
    customer_info: { type: { String }, required: true },
    status: {
      type: String,
      enum: ["cancelled", "pending", "delivered"],
      required: true,
    },
    payment_method: { type: String, required: true },
    total: { type: Number, required: true },
    items: { type: Number, required: true },
    delivery_option: { type: String, required: true },
    shipping_fee: { type: Number, required: true },
  },
  { collection: "orders", timestamps: true }
);

const OrderModel = mongoose.model("orders", orderSchema);

export default OrderModel;
