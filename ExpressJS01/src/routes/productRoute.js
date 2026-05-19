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
} from "../controllers/productController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes — fixed paths BEFORE dynamic /:idOrSlug
router.get("/", getProducts);
router.get("/top-sellers", getTopSellers);
router.get("/most-viewed", getMostViewed);
router.get("/:idOrSlug", getProductByIdOrSlug);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post("/", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.put("/:id/stock", isAdmin, updateProductStock);

export default router;

