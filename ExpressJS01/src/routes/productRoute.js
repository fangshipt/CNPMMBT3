import express from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductByIdOrSlug,
  updateProduct,
  getRelatedProducts,
  updateProductStock,
} from "../controllers/productController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:idOrSlug", getProductByIdOrSlug);
router.get("/:id/related", getRelatedProducts);

// Admin routes
router.post("/", isAdmin, createProduct);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.put("/:id/stock", isAdmin, updateProductStock);

export default router;

