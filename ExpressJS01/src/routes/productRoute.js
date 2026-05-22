import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductByIdOrSlug,
  updateProduct,
  getRelatedProducts,
  updateProductStock,
  getTopSellers,
  getMostViewed,
  canReview,
  addReview,
} from "../controllers/productController.js";
import { isAdmin } from "../middleware/auth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes — fixed paths BEFORE dynamic /:idOrSlug
router.get("/", getProducts);
router.get("/top-sellers", getTopSellers);
router.get("/most-viewed", getMostViewed);
router.get("/:id/related", getRelatedProducts);
router.get("/:id/can-review", canReview);
router.post("/:id/reviews", auth, addReview);
router.get("/:idOrSlug", getProductByIdOrSlug);

// Admin routes
router.post("/", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.put("/:id/stock", isAdmin, updateProductStock);

export default router;

