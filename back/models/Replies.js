import mongoose from "mongoose";

const repliesSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    original_message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "mail",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { collection: "replies", timestamps: true }
);

const RepliesModel = mongoose.model("replies", repliesSchema);
export default RepliesModel;
