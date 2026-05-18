import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryByIdOrSlug,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:idOrSlug", getCategoryByIdOrSlug);
router.post("/", isAdmin, createCategory);
router.put("/:id", isAdmin, updateCategory);
router.delete("/:id", isAdmin, deleteCategory);

export default router;
