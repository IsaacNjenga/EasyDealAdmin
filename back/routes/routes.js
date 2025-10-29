import express from "express";
import {
  ChangePassword,
  Login,
  Register,
} from "../controllers/authController.js";
import { updateAvatar, deleteAvatar } from "../controllers/userController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createProduct,
  deleteProduct,
  fetchAvailableProducts,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "../controllers/productController.js";
import {
  createMail,
  emailUpdate,
  readMail,
  readMails,
} from "../controllers/emailController.js";
import {
  replyToEmail,
  createReply,
  fetchReply,
  fetchReplies,
} from "../controllers/replyController.js";
import { fetchActivities } from "../controllers/activityController.js";

const router = express.Router();

//auth routes
router.post("/sign-up", Register);
router.post("/sign-in", Login);
router.post("/change-password", ChangePassword);

//user routes
router.put("/change-avatar", updateAvatar);
router.put("/delete-avatar", deleteAvatar);

//product routes
router.post("/create-product", protectRoute, createProduct);
router.get("/fetch-product", protectRoute, fetchProduct);
router.get("/fetch-all-products", protectRoute, fetchProducts);
router.get("/fetch-available-products", protectRoute, fetchAvailableProducts);
router.put("/update-product", protectRoute, updateProduct);
router.delete("/delete-product", protectRoute, deleteProduct);

//mail routes
router.post("/create-mail", createMail);
router.get("/fetch-mails", protectRoute, readMails);
router.get("/fetch-mail", protectRoute, readMail);
router.put("/mail-update", protectRoute, emailUpdate);

//reply routes
router.post("/reply-to-email", protectRoute, replyToEmail);
router.post("/reply-to-db", protectRoute, createReply);
router.get("/fetch-replies", protectRoute, fetchReplies);
router.get("/fetch-reply", protectRoute, fetchReply);

//activities route
router.get("/fetch-activities", protectRoute, fetchActivities);

export { router as Router };
