import mongoose from "mongoose";
import Product from "../models/product.js";

const normalizeSlug = (value = "") => {
  return value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const createUniqueSlug = async (name, slug, ignoreId = null) => {
  const baseSlug = normalizeSlug(slug || name);

  if (!baseSlug) {
    return "";
  }

  let finalSlug = baseSlug;
  let index = 1;

  while (true) {
    const filter = { slug: finalSlug };

    if (ignoreId) {
      filter._id = { $ne: ignoreId };
    }

    const existingProduct = await Product.findOne(filter);

    if (!existingProduct) {
      return finalSlug;
    }

    finalSlug = `${baseSlug}-${index}`;
    index += 1;
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProductService = async (body) => {
  try {
    const { name, description, price, discountPrice, stock, category, petType, images, isFeatured, isBestSeller, isNewProduct } = body;

    if (!name || !price || !category) {
      return {
        EC: 1,
        EM: "Vui lòng nhập đầy đủ thông tin (name, price, category)",
      };
    }

    if (price < 0 || (discountPrice && discountPrice < 0)) {
      return {
        EC: 1,
        EM: "Giá không thể âm",
      };
    }

    if (!isValidObjectId(category)) {
      return {
        EC: 1,
        EM: "Category không hợp lệ",
      };
    }

    const slug = await createUniqueSlug(name, name);

    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : "",
      price,
      discountPrice: discountPrice || 0,
      stock: stock || 0,
      category,
      petType: petType ? petType.trim() : "",
      images: images || [],
      isFeatured: isFeatured || false,
      isBestSeller: isBestSeller || false,
      isNewProduct: isNewProduct || false,
    });

    return {
      EC: 0,
      EM: "Tạo sản phẩm thành công",
      data: product,
    };
  } catch (error) {
    console.log(">>> error createProductService: ", error);
    return {
      EC: 1,
      EM: error.message || "Lỗi tạo sản phẩm",
    };
  }
};

export const getProductsService = async (query) => {
  try {
    const { page = 1, limit = 10, search = "", category, isFeatured, isBestSeller, isNewProduct, isOnSale, isFreeship, sortBy = "-createdAt" } = query;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (query.isActive === "all") {
      // admin: show all products
    } else if (query.isActive === "false") {
      filter.isActive = false;
    } else {
      filter.isActive = true;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      if (isValidObjectId(category)) {
        filter.category = category;
      }
    }

    if (isFeatured === "true" || isFeatured === true) {
      filter.isFeatured = true;
    }

    if (isBestSeller === "true" || isBestSeller === true) {
      filter.isBestSeller = true;
    }

    if (isNewProduct === "true" || isNewProduct === true) {
      filter.isNewProduct = true;
    }

    if (isOnSale === "true" || isOnSale === true) {
      filter.discountPrice = { $gt: 0 };
    }

    if (isFreeship === "true" || isFreeship === true) {
      const { default: Promotion } = await import("../models/promotion.js");
      const now = new Date();
      const promo = await Promotion.findOne({
        type: "freeship",
        isActive: true,
        $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }],
      }).and([
        { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
      ]);
      if (promo && promo.products.length > 0) {
        filter._id = { $in: promo.products };
      } else if (!promo) {
        // Không có freeship active → trả về rỗng
        filter._id = { $in: [] };
      }
      // Nếu promo tồn tại nhưng products rỗng → áp dụng cho tất cả (không thêm filter _id)
    }

    const minPrice = parseFloat(query.minPrice);
    const maxPrice = parseFloat(query.maxPrice);
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      filter.price = {};
      if (!isNaN(minPrice)) filter.price.$gte = minPrice;
      if (!isNaN(maxPrice)) filter.price.$lte = maxPrice;
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNum);

    return {
      EC: 0,
      EM: "Lấy danh sách sản phẩm thành công",
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalPages,
        totalProducts,
      },
    };
  } catch (error) {
    console.log(">>> error getProductsService: ", error);
    return {
      EC: 1,
      EM: error.message || "Lỗi lấy danh sách sản phẩm",
    };
  }
};

export const getProductByIdOrSlugService = async (idOrSlug) => {
  try {
    if (!idOrSlug) {
      return { EC: 1, EM: "Vui lòng cung cấp ID hoặc slug" };
    }

    const filter = { isActive: true };
    if (isValidObjectId(idOrSlug)) {
      filter._id = idOrSlug;
    } else {
      filter.slug = idOrSlug;
    }

    // Increment views atomically and return updated document
    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate("category", "name slug")
      .populate("reviews.user", "fullName avatar");

    if (!product) {
      return { EC: 1, EM: "Sản phẩm không tồn tại" };
    }

    return { EC: 0, EM: "Lấy chi tiết sản phẩm thành công", data: product };
  } catch (error) {
    console.log(">>> error getProductByIdOrSlugService: ", error);
    return { EC: 1, EM: error.message || "Lỗi lấy chi tiết sản phẩm" };
  }
};

export const updateProductService = async (id, body) => {
  try {
    if (!isValidObjectId(id)) {
      return {
        EC: 1,
        EM: "ID sản phẩm không hợp lệ",
      };
    }

    const product = await Product.findById(id);

    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    const { name, description, price, discountPrice, stock, category, petType, images, isFeatured, isBestSeller, isNewProduct, isActive } = body;

    if (price !== undefined && price < 0) {
      return {
        EC: 1,
        EM: "Giá không thể âm",
      };
    }

    if (discountPrice !== undefined && discountPrice < 0) {
      return {
        EC: 1,
        EM: "Giá giảm không thể âm",
      };
    }

    if (category && !isValidObjectId(category)) {
      return {
        EC: 1,
        EM: "Category không hợp lệ",
      };
    }

    let updateSlug = product.slug;
    if (name && name !== product.name) {
      updateSlug = await createUniqueSlug(name, name, id);
    }

    const updateData = {
      name: name ? name.trim() : product.name,
      slug: updateSlug,
      description: description !== undefined ? description.trim() : product.description,
      price: price !== undefined ? price : product.price,
      discountPrice: discountPrice !== undefined ? discountPrice : product.discountPrice,
      stock: stock !== undefined ? stock : product.stock,
      category: category || product.category,
      petType: petType !== undefined ? petType.trim() : product.petType,
      images: images !== undefined ? images : product.images,
      isFeatured: isFeatured !== undefined ? isFeatured : product.isFeatured,
      isBestSeller: isBestSeller !== undefined ? isBestSeller : product.isBestSeller,
      isNewProduct: isNewProduct !== undefined ? isNewProduct : product.isNewProduct,
      isActive: isActive !== undefined ? isActive : product.isActive,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return {
      EC: 0,
      EM: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    };
  } catch (error) {
    console.log(">>> error updateProductService: ", error);
    return {
      EC: 1,
      EM: error.message || "Lỗi cập nhật sản phẩm",
    };
  }
};

export const deleteProductService = async (id) => {
  try {
    if (!isValidObjectId(id)) {
      return {
        EC: 1,
        EM: "ID sản phẩm không hợp lệ",
      };
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    return {
      EC: 0,
      EM: "Xoá sản phẩm thành công",
      data: deletedProduct,
    };
  } catch (error) {
    console.log(">>> error deleteProductService: ", error);
    return {
      EC: 1,
      EM: error.message || "Lỗi xoá sản phẩm",
    };
  }
};

export const getRelatedProductsService = async (productId, limit = 6) => {
  try {
    if (!isValidObjectId(productId)) {
      return {
        EC: 1,
        EM: "ID sản phẩm không hợp lệ",
      };
    }

    const product = await Product.findById(productId);

    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      category: product.category,
      isActive: true,
    })
      .populate("category", "name slug")
      .limit(parseInt(limit) || 6)
      .lean();

    return {
      EC: 0,
      EM: "Lấy sản phẩm liên quan thành công",
      data: relatedProducts,
    };
  } catch (error) {
    console.log(">>> error getRelatedProductsService: ", error);
    return {
      EC: 1,
      EM: error.message || "Lỗi lấy sản phẩm liên quan",
    };
  }
};

export const getTopSellersService = async (limit = 10) => {
  try {
    const products = await Product.find({ isActive: true, sold: { $gt: 0 } })
      .populate("category", "name slug")
      .sort({ sold: -1 })
      .limit(Math.min(parseInt(limit) || 10, 50))
      .lean();

    return { EC: 0, EM: "Lấy top sản phẩm bán chạy thành công", data: products };
  } catch (error) {
    console.log(">>> error getTopSellersService: ", error);
    return { EC: 1, EM: error.message || "Lỗi lấy top bán chạy" };
  }
};

export const getMostViewedService = async (limit = 10) => {
  try {
    const products = await Product.find({ isActive: true, views: { $gt: 0 } })
      .populate("category", "name slug")
      .sort({ views: -1 })
      .limit(Math.min(parseInt(limit) || 10, 50))
      .lean();

    return { EC: 0, EM: "Lấy top sản phẩm xem nhiều thành công", data: products };
  } catch (error) {
    console.log(">>> error getMostViewedService: ", error);
    return { EC: 1, EM: error.message || "Lỗi lấy top xem nhiều" };
  }
};

export const canReviewService = async (productId, userId) => {
  try {
    const { default: Order } = await import("../models/order.js");
    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      status: "delivered",
    });
    const product = await Product.findById(productId).select("reviews");
    const alreadyReviewed = product?.reviews?.some(
      (r) => r.user.toString() === userId.toString()
    );
    return { EC: 0, data: { canReview: !!order && !alreadyReviewed } };
  } catch (error) {
    return { EC: 1, EM: error.message };
  }
};

export const addReviewService = async (productId, userId, { rating, comment }) => {
  try {
    const { default: Order } = await import("../models/order.js");
    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      status: "delivered",
    });
    if (!order) {
      return { EC: 1, EM: "Bạn chưa mua sản phẩm này hoặc đơn hàng chưa giao thành công" };
    }

    const product = await Product.findById(productId);
    if (!product) return { EC: 1, EM: "Sản phẩm không tồn tại" };

    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === userId.toString()
    );
    if (alreadyReviewed) return { EC: 1, EM: "Bạn đã đánh giá sản phẩm này rồi" };

    product.reviews.push({ user: userId, rating: Number(rating), comment: comment || "" });
    const total = product.reviews.reduce((s, r) => s + r.rating, 0);
    product.rating = Math.round((total / product.reviews.length) * 10) / 10;
    await product.save();

    const { default: User } = await import("../models/user.js");
    const populated = await Product.findById(productId).populate("reviews.user", "fullName avatar");
    return { EC: 0, EM: "Đánh giá thành công", data: populated.reviews };
  } catch (error) {
    return { EC: 1, EM: error.message };
  }
};

export const updateProductStockService = async (productId, quantity) => {
  try {
    if (!isValidObjectId(productId)) {
      return {
        EC: 1,
        EM: "ID sản phẩm không hợp lệ",
      };
    }

    const product = await Product.findById(productId);

    if (!product) {
      return {
        EC: 1,
        EM: "Sản phẩm không tồn tại",
      };
    }

    if (product.stock < quantity) {
      return {
        EC: 1,
        EM: "Không đủ hàng",
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { stock: -quantity, sold: quantity },
      },
      { new: true }
    );

    return {
      EC: 0,
      EM: "Cập nhật tồn kho thành công",
      data: updatedProduct,
    };
  } catch (error) {
    console.log(">>> error updateProductStockService: ", error);
    return {
      EC: 1,
      EM: error.message || "Lỗi cập nhật tồn kho",
    };
  }
};
