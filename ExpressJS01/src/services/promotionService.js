import Promotion from "../models/promotion.js";
import Product from "../models/product.js";

const applyDiscount = (price, type, value) => {
  if (type === "percent") return Math.round(price * (1 - value / 100));
  return Math.max(0, price - value);
};

export const getPromotionsService = async () => {
  try {
    const promotions = await Promotion.find().populate("products", "name price discountPrice images").sort("-createdAt");
    return { EC: 0, data: promotions };
  } catch (error) {
    return { EC: 1, EM: error.message };
  }
};

export const createPromotionService = async (body) => {
  try {
    const { name, description, type, value, products, startDate, endDate, isActive } = body;
    if (!name || !type || value === undefined) return { EC: 1, EM: "Thiếu thông tin khuyến mãi" };

    const promotion = await Promotion.create({ name, description, type, value, products: products || [], startDate, endDate, isActive: isActive !== false });

    if (promotion.isActive && products?.length) {
      await Promise.all(
        products.map(async (pid) => {
          const product = await Product.findById(pid);
          if (product) {
            product.discountPrice = applyDiscount(product.price, type, value);
            await product.save();
          }
        })
      );
    }

    return { EC: 0, EM: "Tạo khuyến mãi thành công", data: promotion };
  } catch (error) {
    return { EC: 1, EM: error.message };
  }
};

export const updatePromotionService = async (id, body) => {
  try {
    const { name, description, type, value, products, startDate, endDate, isActive } = body;
    const promotion = await Promotion.findById(id);
    if (!promotion) return { EC: 1, EM: "Không tìm thấy khuyến mãi" };

    // Reset discountPrice của products cũ
    if (promotion.products.length) {
      await Product.updateMany({ _id: { $in: promotion.products } }, { discountPrice: 0 });
    }

    Object.assign(promotion, { name, description, type, value, products: products || [], startDate, endDate, isActive });
    await promotion.save();

    // Áp dụng discount mới nếu isActive
    if (promotion.isActive && products?.length) {
      await Promise.all(
        products.map(async (pid) => {
          const product = await Product.findById(pid);
          if (product) {
            product.discountPrice = applyDiscount(product.price, type, value);
            await product.save();
          }
        })
      );
    }

    return { EC: 0, EM: "Cập nhật khuyến mãi thành công", data: promotion };
  } catch (error) {
    return { EC: 1, EM: error.message };
  }
};

export const deletePromotionService = async (id) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(id);
    if (!promotion) return { EC: 1, EM: "Không tìm thấy khuyến mãi" };
    // Reset discountPrice
    if (promotion.products.length) {
      await Product.updateMany({ _id: { $in: promotion.products } }, { discountPrice: 0 });
    }
    return { EC: 0, EM: "Đã xóa khuyến mãi" };
  } catch (error) {
    return { EC: 1, EM: error.message };
  }
};
