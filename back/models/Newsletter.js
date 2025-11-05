import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    sent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "newsletter", timestamps: true }
);

const NewsletterModel = mongoose.model("newsletter", newsletterSchema);
export default NewsletterModel;
