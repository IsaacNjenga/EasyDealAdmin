import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String] },
    colour: { type: [String], required: true },
    type: { type: String, required: true },
    category: { type: String, required: true },
    freeShipping: { type: Boolean },
    available: { type: Boolean, required: true },
    stockCount: { type: Number, required: true },
    material: { type: String },
    dimensions: { type: String },
    rating: { type: Number },
    totalReviews: { type: Number },
    shippingInformation: { type: [String] },
    careGuide: { type: [String] },
    tags: { type: [String], required: true },
    discount: { type: Number },
  },
  { collection: "products", timestamps: true }
);

const ProductsModel = mongoose.model("products", productSchema);
export default ProductsModel;
