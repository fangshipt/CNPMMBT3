import express from "express";
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from "../controllers/promotionController.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAdmin, getPromotions);
router.post("/", isAdmin, createPromotion);
router.put("/:id", isAdmin, updatePromotion);
router.delete("/:id", isAdmin, deletePromotion);

export default router;
