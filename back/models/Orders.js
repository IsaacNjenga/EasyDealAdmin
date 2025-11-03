import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order: { type: [String], required: true },
    date: { type: Date, required: true },
    customer: { type: { String }, required: true },
    payment_status: { type: String, required: true },
    total: { type: Number, required: true },
    items: { type: Number, required: true },
    delivery_method: { type: String, required: true },
  },
  { collection: "orders", timestamps: true }
);

const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
