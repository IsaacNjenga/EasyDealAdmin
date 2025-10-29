import RepliesModel from "../models/Replies.js";
import { logActivity } from "../utils/logActivity.js";

const createReply = async (req, res) => {
  try {
    const newReply = new RepliesModel(req.body);

    await newReply.populate("original_message", "full_name");
    //logging the activity
    await logActivity(
      "reply",
      newReply._id,
      "created",
      `New reply to an email from ${newReply.original_message.full_name}`,
      "",
      "replies"
    );

    await newReply.save();
    res.status(201).json({ success: true, reply: newReply });
  } catch (error) {
    console.error("Error in creating reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchReplies = async (req, res) => {
  try {
    const replies = await RepliesModel.find({}).populate("original_message");
    res.status(200).json({ success: true, replies });
  } catch (error) {
    console.error("Error in fetching replies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchReply = async (req, res) => {
  const { id } = req.query;
  try {
    const reply = await RepliesModel.findById(id).populate("original_message");
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Error in fetching reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createReply, fetchReplies, fetchReply };
