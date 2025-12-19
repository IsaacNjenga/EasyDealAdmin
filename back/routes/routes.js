import express from "express";
import {
  ChangePassword,
  Login,
  refreshMyToken,
  Register,
} from "../controllers/authController.js";
import { updateAvatar, deleteAvatar } from "../controllers/userController.js";
import protectRoute from "../middleware/auth.middleware.js";
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
  createReply,
  fetchReply,
  fetchReplies,
} from "../controllers/repliesController.js";
import {
  clientOrderUpdate,
  createOrder,
  fetchAllOrders,
  fetchOrder,
  fetchOrders,
  orderUpdate,
} from "../controllers/ordersController.js";
import {
  createAnalytics,
  decrementLikes,
  incrementLikes,
  incrementViews,
  updateAnalytics,
  topAnalytics,
  incrementCart,
  decrementCart,
} from "../controllers/analyticsController.js";
import { fetchActivities } from "../controllers/activityController.js";
import { replyToEmail } from "../controllers/clientReplyController.js";
import { sendNewsletter } from "../controllers/newsletterController.js";
import {
  clientLogin,
  clientRegister,
  fetchClient,
  fetchClients,
  firebaseGoogleLogin,
  fetchClientDetails,
} from "../controllers/clientController.js";
import {
  createReview,
  deleteReview,
  fetchReviews,
  updateReview,
} from "../controllers/reviewsController.js";

const router = express.Router();

//auth routes
router.post("/sign-up", Register);
router.post("/sign-in", Login);
router.post("/change-password", ChangePassword);
router.post("/refresh-token", refreshMyToken);

//client auth routes
router.post("/client-sign-up", clientRegister);
router.post("/client-sign-in", clientLogin);
router.post("/firebase-google-login", firebaseGoogleLogin);
router.get("/fetch-clients", fetchClients);
//router.get("/fetch-client", fetchClient);
router.get("/fetch-client", fetchClientDetails);

//user routes
router.put("/change-avatar", updateAvatar);
router.put("/delete-avatar", deleteAvatar);

//product routes
router.post("/create-product", protectRoute, createProduct);
router.get("/fetch-product", fetchProduct);
router.get("/fetch-all-products", fetchProducts);
router.get("/fetch-available-products", protectRoute, fetchAvailableProducts);
router.put("/update-product", protectRoute, updateProduct);
router.delete("/delete-product", deleteProduct);

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

//orders routes
router.post("/create-order", createOrder);
router.get("/fetch-orders", protectRoute, fetchOrders);
router.get("/fetch-all-orders", protectRoute, fetchAllOrders);
router.get("/fetch-order", protectRoute, fetchOrder);
router.put("/order-update", protectRoute, orderUpdate);
router.put("/client-order-update", clientOrderUpdate);

//newsletter routes
router.post("/send-newsletter", protectRoute, sendNewsletter);

//reviews routes
router.post("/create-review", createReview);
router.get("/fetch-reviews", fetchReviews);
router.put("/update-review", updateReview);
router.delete("/delete-review", deleteReview);

//analytics route
router.post("/create-analytics", createAnalytics);
router.post("/analytics/views/:productId", incrementViews);
router.post("/analytics/like/:productId", incrementLikes);
router.post("/analytics/unlike/:productId", decrementLikes);
router.post("/analytics/add-to-cart/:productId", incrementCart);
router.post("/analytics/remove-from-cart/:productId", decrementCart);
router.put("/update-analytic", updateAnalytics);
router.get("/top-analytics", protectRoute, topAnalytics);

//activities route
router.get("/fetch-activities", protectRoute, fetchActivities);

export { router as Router };
