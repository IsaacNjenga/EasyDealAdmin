import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    refId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "refModel",
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted"],
      required: true,
    },
    title: String,
    description: String,
    refModel: {
      type: String,
      required: true,
      enum: ["mail", "user", "products", "replies", "orders", "reviews"],
    },
  },
  { collection: "activity", timestamps: true }
);

const ActivityModel = mongoose.model("activity", activitySchema);
export default ActivityModel;
