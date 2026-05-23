import mongoose from "mongoose";
import Category from "../models/category.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

await Category.deleteMany();

const categories = [
  {
    _id: new mongoose.Types.ObjectId("6a0c86d8e015cd111ec3671a"),
    name: "Thức ăn",
    slug: "thuc-an",
    image: "https://res.cloudinary.com/dulymjapc/image/upload/v1779287005/petshop-products/ugnmuisqcwihdbbhgag2.png",
    description: "Thức ăn dành cho thú cưng",
    parent: null,
    isActive: true,
    sortOrder: 1,
    metaTitle: "Thức ăn thú cưng",
    metaDescription: "Các loại thức ăn cho thú cưng",
    createdAt: new Date("2026-05-19T15:50:48.069Z"),
    updatedAt: new Date("2026-05-20T14:23:26.353Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("6a0c86d8e015cd111ec3671b"),
    name: "Cho chim",
    slug: "cho-chim",
    image: "https://res.cloudinary.com/dulymjapc/image/upload/v1779287071/petshop-products/eiu6vwymyrpohebtcqmq.png",
    description: "Sản phẩm dành cho chim",
    parent: null,
    isActive: true,
    sortOrder: 5,
    metaTitle: "Đồ dùng cho chim",
    metaDescription: "Thức ăn và phụ kiện cho chim",
    createdAt: new Date("2026-05-19T15:50:48.070Z"),
    updatedAt: new Date("2026-05-20T14:24:33.345Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("6a0c86d8e015cd111ec3671c"),
    name: "Cho chó",
    slug: "cho-cho",
    image: "https://res.cloudinary.com/dulymjapc/image/upload/v1779287020/petshop-products/cim4t1ic4075s1hvz7yh.png",
    description: "Sản phẩm dành cho chó",
    parent: null,
    isActive: true,
    sortOrder: 2,
    metaTitle: "Đồ dùng cho chó",
    metaDescription: "Thức ăn, đồ chơi và phụ kiện cho chó",
    createdAt: new Date("2026-05-19T15:50:48.070Z"),
    updatedAt: new Date("2026-05-20T14:23:41.860Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("6a0c86d8e015cd111ec3671d"),
    name: "Cho cá",
    slug: "cho-ca",
    image: "https://res.cloudinary.com/dulymjapc/image/upload/v1779287056/petshop-products/rupu0ozvfiwk4z0fe19o.png",
    description: "Sản phẩm dành cho cá",
    parent: null,
    isActive: true,
    sortOrder: 4,
    metaTitle: "Đồ dùng cho cá",
    metaDescription: "Thức ăn và phụ kiện cho cá",
    createdAt: new Date("2026-05-19T15:50:48.070Z"),
    updatedAt: new Date("2026-05-20T14:24:19.463Z"),
  },
  {
    _id: new mongoose.Types.ObjectId("6a0c86d8e015cd111ec3671e"),
    name: "Cho mèo",
    slug: "cho-meo",
    image: "https://res.cloudinary.com/dulymjapc/image/upload/v1779287044/petshop-products/liv0idij5pzk9vfa8shc.png",
    description: "Sản phẩm dành cho mèo",
    parent: null,
    isActive: true,
    sortOrder: 3,
    metaTitle: "Đồ dùng cho mèo",
    metaDescription: "Thức ăn, đồ chơi và phụ kiện cho mèo",
    createdAt: new Date("2026-05-19T15:50:48.070Z"),
    updatedAt: new Date("2026-05-20T14:24:06.793Z"),
  },
];

await Category.insertMany(categories, { timestamps: false });

console.log("Categories seeded successfully");

process.exit();
