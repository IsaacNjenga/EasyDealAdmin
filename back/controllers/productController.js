import { connectDB } from "../config/db.js";
import ProductsModel from "../models/Products.js";
import { logActivity } from "../utils/logActivity.js";
import mongoose from "mongoose";

const createProduct = async (req, res) => {
  await connectDB();
  try {
    const newProduct = new ProductsModel(req.body);

    //logging the activity
    await logActivity(
      "Product",
      newProduct._id,
      "created",
      `New product created: ${newProduct.name}`,
      `${newProduct.name} at ${newProduct.price}`,
      "products"
    );

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error in creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchProduct = async (req, res) => {
  await connectDB();
  const { id } = req.query;
  try {
    const product = await ProductsModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },
      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "productId",
          as: "analytics",
        },
      },
    ]);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error in fetching Product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchProducts = async (req, res) => {
  await connectDB();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const products = await ProductsModel.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },

      {
        $lookup: {
          from: "analytics",
          localField: "_id",
          foreignField: "productId",
          as: "analytics",
        },
      },

      // OPTIONAL: sort reviews newest first
      {
        $addFields: {
          reviews: { $reverseArray: "$reviews" },
        },
      },
    ]);

    const totalProducts = await ProductsModel.countDocuments();

    res.status(200).json({
      success: true,
      products,
      currentPage: page,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Error in fetching Products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchAvailableProducts = async (req, res) => {
  await connectDB();
  try {
    const availableProduct = await ProductsModel.find({
      available: "true",
    });
    res.status(200).json({ success: true, availableProduct });
  } catch (error) {
    console.log("Error in fetching available Products", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.query;
    const updatedProduct = await ProductsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logActivity(
      "Product",
      updatedProduct._id,
      "updated",
      `A Product was updated: ${updatedProduct.name}`,
      `Priced at ${updatedProduct.price}`,
      "products"
    );

    res.status(200).json({ success: true, Product: updatedProduct });
  } catch (error) {
    console.error("Error in updating Product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.query;
    const deletedProduct = await ProductsModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logActivity(
      "Product",
      deletedProduct._id,
      "deleted",
      `A Product was deleted: ${deletedProduct.name}`,
      "",
      "products"
    );

    res.status(200).json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.error("Error in deleting Product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
  fetchAvailableProducts,
  deleteProduct,
};
