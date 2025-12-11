import { connectDB } from "../config/db.js";
import ClientModel from "../models/Client.js";
import ReviewsModel from "../models/Reviews.js";
import { logActivity } from "../utils/logActivity.js";

const createReview = async (req, res) => {
  await connectDB();
  const { email, propertyId } = req.body;

  try {
    const existingReview = await ReviewsModel.findOne({ email, propertyId });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already submitted a review for this property.",
      });
    }

    const newReview = new ReviewsModel(req.body);

    await logActivity(
      "review",
      newReview._id,
      "created",
      `New rating of ${newReview.rating}`,
      `${newReview.name} has given a rating of ${newReview.rating} on a product`,
      "reviews"
    );

    await newReview.save();

    await ClientModel.findOneAndUpdate(
      { email },
      {
        $addToSet: { reviews: newReview._id },
        $inc: { "stats.reviews": 1 },
      },
      { new: true }
    );

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error in creating review:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const fetchReviews = async (req, res) => {
  await connectDB();
  try {
    const reviews = await ReviewsModel.find({}).populate("propertyId");
    res.status(200).json({ success: true, reviews: reviews });
  } catch (error) {
    console.error("Error in fetching reviews:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateReview = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.query;
    const updatedReview = await ReviewsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    await logActivity(
      "review",
      updatedReview._id,
      "updated",
      `A review was updated`,
      `New rating at ${updatedReview.rating}`,
      "reviews"
    );

    res.status(200).json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("Error in updating review:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  await connectDB();
  try {
    const { id, email } = req.query;
    const deletedReview = await ReviewsModel.findByIdAndDelete(id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    await logActivity(
      "review",
      deletedReview._id,
      "deleted",
      `A review was deleted`,
      "",
      "reviews"
    );

    await ClientModel.findOneAndUpdate(
      { email },
      {
        $pull: { reviews: deletedReview._id },
        $inc: { "stats.reviews": -1 },
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error in deleting review:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { createReview, fetchReviews, updateReview, deleteReview };
