import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: [String] },
    colour: { type: [String], required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    material: { type: String },
    dimensions: { type: String },
    rating: { type: Number },
    totalReviews: { type: Number },
    shippingInformation: { type: [String] },
    careGuide: { type: [String] },
    tags: { type: [String], required: true },
    discount: { type: Number, default: null },
    offerStartDate: { type: Date, default: null },
    offerEndDate: { type: Date, default: null },
    discountAvailable: { type: Boolean, required: true, default: false },
  },
  { collection: "products", timestamps: true }
);

// This pre-save hook is good for individual saves but won't affect updateMany
productSchema.pre("save", function (next) {
  if (
    this.discountAvailable &&
    this.offerEndDate &&
    this.offerEndDate <= new Date()
  ) {
    this.discountAvailable = false;
    this.discount = null;
    this.offerStartDate = null;
    this.offerEndDate = null;
  }
  next();
});

const ProductsModel = mongoose.model("products", productSchema);

export default ProductsModel;
