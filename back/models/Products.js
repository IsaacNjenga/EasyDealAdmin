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
    freeShipping: { type: Boolean },
    available: { type: Boolean, required: true },
    material: { type: String },
    dimensions: { type: String },
    rating: { type: Number },
    totalReviews: { type: Number },
    shippingInformation: { type: [String] },
    careGuide: { type: [String] },
    tags: { type: [String], required: true },
    discount: { type: Number },
    offerStartDate: { type: Date, default: null },
    offerEndDate: { type: Date, default: null },
    discountAvailable: { type: Boolean, required: true, default: false },
  },
  { collection: "products", timestamps: true }
);


const ProductsModel = mongoose.model("products", productSchema);
/**
 * EXTRA HARDENING
 * Runs EVERY time a product is saved
 */
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

export default ProductsModel;
