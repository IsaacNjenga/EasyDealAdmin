import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
      index: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { collection: "analytics", timestamps: true }
);

const AnalyticsModel = mongoose.model("analytics", analyticsSchema);
export default AnalyticsModel;
