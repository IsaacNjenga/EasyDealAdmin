import { connectDB } from "../config/db.js";
import OrderModel from "../models/Orders.js";
import { logActivity } from "../utils/logActivity.js";

const createOrder = async (req, res) => {
  await connectDB();
  try {
    const newOrder = new OrderModel(req.body);

    //logging the activity
    await logActivity(
      "order",
      newOrder._id,
      "created",
      `New order made!`,
      `An item has been ordered`,
      "orders"
    );
    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error in creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchOrders = async (req, res) => {
  await connectDB();
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  try {
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalOrders = await OrderModel.countDocuments();
    res.status(200).json({
      success: true,
      orders,
      currentPage: page,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
    });
  } catch (error) {
    console.error("Error in fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAllOrders = async (req, res) => {
  await connectDB();
  try {
    const orders = await OrderModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchOrder = async (req, res) => {
  await connectDB();
  const { id } = req.query;
  try {
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error in fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const orderUpdate = async (req, res) => {
  await connectDB();
  const { id } = req.query;
  const updateData = req.body;
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error in order update:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const clientOrderUpdate = async (req, res) => {
  await connectDB();
  const { tracking_id } = req.query;
  try {
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderTrackingId: tracking_id },
      { transaction_data: { ...req.body } },
      {
        new: true,
      }
    );
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error in order update:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export {
  createOrder,
  fetchOrders,
  fetchOrder,
  fetchAllOrders,
  orderUpdate,
  clientOrderUpdate,
};
