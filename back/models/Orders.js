import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order: { type: Array, required: true },
    date: { type: Date, required: true },
    customer_info: { type: Object, required: true },
    order_status: {
      type: String,
      enum: ["cancelled", "pending", "delivered"],
      default: "pending",
      required: true,
    },
    payment_method: { type: String, required: true },
    total: { type: Number, required: true },
    items: { type: Number, required: true },
    delivery_option: { type: String, required: true },
    shipping_fee: { type: Number },
    orderTrackingId: { type: String },
    transaction_data: { type: Object },
  },
  { collection: "orders", timestamps: true }
);

const OrderModel = mongoose.model("orders", orderSchema);

export default OrderModel;
