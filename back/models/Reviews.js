import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    review: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { collection: "reviews", timestamps: true }
);

// Ensure each user can only leave one review per property
reviewSchema.index({ email: 1, productId: 1 }, { unique: true });

const ReviewsModel = mongoose.model("reviews", reviewSchema);
export default ReviewsModel;
