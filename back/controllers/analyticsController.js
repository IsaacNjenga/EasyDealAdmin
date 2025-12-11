import { connectDB } from "../config/db.js";
import AnalyticsModel from "../models/Analytics.js";
import ClientModel from "../models/Client.js";

const createAnalytics = async (req, res) => {
  await connectDB();
  try {
    const newAnalytic = new AnalyticsModel(req.body);
    await newAnalytic.save();
    return res.status(201).json({ message: "Analytics created successfully" });
  } catch (error) {
    console.error("Error in analytics creation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const incrementViews = async (req, res) => {
  await connectDB();
  const { productId } = req.params;
  try {
    await AnalyticsModel.findOneAndUpdate(
      { productId },
      { $inc: { views: 1 } },
      { upsert: true }
    );

    res.sendStatus(204); // success with no payload
  } catch (error) {
    console.error("Error in views incrementing:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const incrementLikes = async (req, res) => {
  await connectDB();
  const { productId } = req.params;
  const { email } = req.query;
  try {
    await ClientModel.findOneAndUpdate(
      { email },
      {
        $addToSet: { favourites: productId },
        $inc: { "stats.favourites": 1 },
      },
      { new: true }
    );

    await AnalyticsModel.findOneAndUpdate(
      { productId },
      { $inc: { likes: 1 } },
      { upsert: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error in likes incrementing:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const incrementCart = async (req, res) => {
  await connectDB();

  const { productId } = req.params;
  const { email } = req.query;
  try {
    await ClientModel.findOneAndUpdate(
      { email },
      {
        $addToSet: { cart: productId },
        $inc: { "stats.cart": 1 },
      },
      { new: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error in cart incrementing:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const decrementLikes = async (req, res) => {
  await connectDB();
  const { productId } = req.params;
  const { email } = req.query;
  try {
    await ClientModel.findOneAndUpdate(
      { email },
      {
        $pull: { favourites: productId },
        $inc: { "stats.favourites": -1 },
      },
      { new: true }
    );

    await AnalyticsModel.findOneAndUpdate(
      { productId },
      { $inc: { likes: -1 } },
      { upsert: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error in likes incrementing:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const decrementCart = async (req, res) => {
  await connectDB();

  const { productId } = req.params;
  const { email } = req.query;
  try {
    await ClientModel.findOneAndUpdate(
      { email },
      {
        $addToSet: { cart: productId },
        $inc: { "stats.cart": -1 },
      },
      { new: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error in cart incrementing:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAnalytics = async (req, res) => {
  await connectDB();
  try {
    const summary = await AnalyticsModel.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likes" },
          totalProductsTracked: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      summary: summary[0] || {},
    });
  } catch (error) {
    console.error("Error in analytics fetch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const topAnalytics = async (req, res) => {
  await connectDB();
  try {
    const topViewed = await AnalyticsModel.find()
      .sort({ views: -1 })
      .limit(5)
      .populate("productId");

    res.status(200).json({ success: true, topViewed: topViewed });
  } catch (error) {
    console.error("Error in analytics fetch:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateAnalytics = async (req, res) => {
  await connectDB();
  const { id } = req.query;
  try {
    const updateAnalytic = await AnalyticsModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!updateAnalytic) {
      return res.status(404).json({ message: "Analytics not found" });
    }
    return res.status(200).json({ success: true, analytic: updateAnalytic });
  } catch (error) {
    console.error("Error in analytics updation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createAnalytics,
  fetchAnalytics,
  updateAnalytics,
  incrementViews,
  incrementLikes,
  decrementLikes,
  decrementCart,
  incrementCart,
  topAnalytics,
};
