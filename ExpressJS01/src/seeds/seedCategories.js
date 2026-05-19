import mongoose from "mongoose";

import Category from "../models/category.js";
await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

await Category.deleteMany();

const categories = [
  {
    name: "Thức ăn",
    slug: "thuc-an",
    image:
      "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",

    description: "Thức ăn dành cho thú cưng",

    sortOrder: 1,

    metaTitle: "Thức ăn thú cưng",
    metaDescription: "Các loại thức ăn cho thú cưng",
  },

  {
    name: "Cho chim",
    slug: "cho-chim",
    image:
      "https://cdn-icons-png.flaticon.com/512/3069/3069172.png",

    description: "Sản phẩm dành cho chim",

    sortOrder: 2,

    metaTitle: "Đồ dùng cho chim",
    metaDescription: "Thức ăn và phụ kiện cho chim",
  },

  {
    name: "Cho chó",
    slug: "cho-cho",
    image:
      "https://cdn-icons-png.flaticon.com/512/616/616408.png",

    description: "Sản phẩm dành cho chó",

    sortOrder: 3,

    metaTitle: "Đồ dùng cho chó",
    metaDescription: "Thức ăn, đồ chơi và phụ kiện cho chó",
  },

  {
    name: "Cho cá",
    slug: "cho-ca",
    image:
      "https://cdn-icons-png.flaticon.com/512/616/616494.png",

    description: "Sản phẩm dành cho cá",

    sortOrder: 4,

    metaTitle: "Đồ dùng cho cá",
    metaDescription: "Thức ăn và phụ kiện cho cá",
  },

  {
    name: "Cho mèo",
    slug: "cho-meo",
    image:
      "https://cdn-icons-png.flaticon.com/512/616/616430.png",

    description: "Sản phẩm dành cho mèo",

    sortOrder: 5,

    metaTitle: "Đồ dùng cho mèo",
    metaDescription: "Thức ăn, đồ chơi và phụ kiện cho mèo",
  },
];

await Category.insertMany(categories);

console.log("Categories seeded successfully");

process.exit();