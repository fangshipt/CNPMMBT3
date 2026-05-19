import express from "express";
import upload from "../middleware/upload.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/product",
  auth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ EC: 1, EM: "Không có file nào được tải lên", data: null });
      }

      const imageUrls = req.files.map((file) => file.path);

      return res.status(200).json({
        EC: 0,
        EM: "Upload thành công",
        data: imageUrls,
      });
    } catch (error) {
      return res.status(500).json({ EC: -1, EM: error.message, data: null });
    }
  }
);

export default router;
