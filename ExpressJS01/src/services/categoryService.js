import mongoose from "mongoose";
import Category from "../models/category.js";

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

    const existingCategory = await Category.findOne(filter);

    if (!existingCategory) {
      return finalSlug;
    }

    finalSlug = `${baseSlug}-${index}`;
    index += 1;
  }
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createCategoryService = async (body) => {
  try {
    const { name } = body;

    if (!name) {
      return {
        EC: 1,
        EM: "Vui lòng nhập tên danh mục",
      };
    }

    if (body.parent && !isValidObjectId(body.parent)) {
      return {
        EC: 1,
        EM: "Danh mục cha không hợp lệ",
      };
    }

    const slug = await createUniqueSlug(name, body.slug);

    if (!slug) {
      return {
        EC: 1,
        EM: "Slug không hợp lệ",
      };
    }

    const category = await Category.create({
      name,
      slug,
      image: body.image || "",
      description: body.description || "",
      parent: body.parent || null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
      metaTitle: body.metaTitle || "",
      metaDescription: body.metaDescription || "",
    });

    return {
      EC: 0,
      EM: "Tạo danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

export const getCategoriesService = async (query) => {
  try {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);
    const skip = (page - 1) * limit;
    const filter = {};

    if (query.keyword) {
      filter.$or = [
        { name: { $regex: query.keyword, $options: "i" } },
        { slug: { $regex: query.keyword, $options: "i" } },
        { description: { $regex: query.keyword, $options: "i" } },
      ];
    }

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive === "true";
    }

    if (query.parent) {
      filter.parent = query.parent === "null" ? null : query.parent;
    }

    const [categories, total] = await Promise.all([
      Category.find(filter)
        .populate("parent", "name slug")
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Category.countDocuments(filter),
    ]);

    return {
      EC: 0,
      EM: "Lấy danh sách danh mục thành công",
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

export const getCategoryByIdOrSlugService = async (idOrSlug) => {
  try {
    const filter = isValidObjectId(idOrSlug)
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const category = await Category.findOne(filter).populate("parent", "name slug");

    if (!category) {
      return {
        EC: 1,
        EM: "Không tìm thấy danh mục",
      };
    }

    return {
      EC: 0,
      EM: "Lấy chi tiết danh mục thành công",
      data: category,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

export const updateCategoryService = async (id, body) => {
  try {
    if (!isValidObjectId(id)) {
      return {
        EC: 1,
        EM: "Id danh mục không hợp lệ",
      };
    }

    const category = await Category.findById(id);

    if (!category) {
      return {
        EC: 1,
        EM: "Không tìm thấy danh mục",
      };
    }

    if (body.parent && !isValidObjectId(body.parent)) {
      return {
        EC: 1,
        EM: "Danh mục cha không hợp lệ",
      };
    }

    if (body.parent && body.parent === id) {
      return {
        EC: 1,
        EM: "Danh mục cha không được trùng với danh mục hiện tại",
      };
    }

    const updateData = {
      ...body,
    };

    if (body.name || body.slug) {
      updateData.slug = await createUniqueSlug(
        body.name || category.name,
        body.slug || category.slug,
        id
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("parent", "name slug");

    return {
      EC: 0,
      EM: "Cập nhật danh mục thành công",
      data: updatedCategory,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};

export const deleteCategoryService = async (id) => {
  try {
    if (!isValidObjectId(id)) {
      return {
        EC: 1,
        EM: "Id danh mục không hợp lệ",
      };
    }

    const hasChildren = await Category.exists({ parent: id });

    if (hasChildren) {
      return {
        EC: 1,
        EM: "Không thể xóa danh mục đang có danh mục con",
      };
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return {
        EC: 1,
        EM: "Không tìm thấy danh mục",
      };
    }

    return {
      EC: 0,
      EM: "Xóa danh mục thành công",
      data: deletedCategory,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi server",
    };
  }
};
