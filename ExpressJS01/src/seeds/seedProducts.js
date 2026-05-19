import mongoose from "mongoose";

import Product from "../models/product.js";
import Category from "../models/category.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

try {
  // clear old products
  await Product.deleteMany();

  // categories
  const dogCategory = await Category.findOne({ name: "Cho chó" });
  const catCategory = await Category.findOne({ name: "Cho mèo" });
  const fishCategory = await Category.findOne({ name: "Cho cá" });
  const birdCategory = await Category.findOne({ name: "Cho chim" });
  const foodCategory = await Category.findOne({ name: "Thức ăn" });

  const products = [
    // DOG
    {
      name: "Royal Canin Mini Adult",
      slug: "royal-canin-mini-adult",
      description: "Thức ăn cao cấp dành cho chó trưởng thành.",
      price: 450000,
      discountPrice: 399000,
      stock: 25,
      sold: 120,
      images: [
        "https://dogily.vn/wp-content/uploads/2021/09/thuc-an-cho-cho-royal-canin-mini-adult.jpg",
      ],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.8,
    },

    {
      name: "Pate SmartHeart Cho Chó",
      slug: "pate-smartheart-cho-cho",
      description: "Pate mềm thơm ngon cho chó mọi lứa tuổi.",
      price: 35000,
      discountPrice: 29000,
      stock: 100,
      sold: 250,
      images: [
        "https://bizweb.dktcdn.net/100/307/433/products/pate-smartheart.jpg",
      ],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.6,
    },

    // CAT
    {
      name: "Catsrang Cho Mèo",
      slug: "catsrang-cho-meo",
      description: "Hạt dinh dưỡng dành cho mèo trưởng thành.",
      price: 320000,
      discountPrice: 279000,
      stock: 40,
      sold: 180,
      images: [
        "https://bizweb.dktcdn.net/100/421/124/products/catsrang.jpg",
      ],
      category: catCategory._id,
      petType: "cat",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.9,
    },

    {
      name: "Cát Vệ Sinh Cho Mèo",
      slug: "cat-ve-sinh-cho-meo",
      description: "Cát vệ sinh khử mùi hiệu quả cho mèo.",
      price: 120000,
      discountPrice: 99000,
      stock: 60,
      sold: 90,
      images: [
        "https://petmart.vn/wp-content/uploads/2020/07/cat-ve-sinh-meo.jpg",
      ],
      category: catCategory._id,
      petType: "cat",
      isFeatured: false,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.5,
    },

    // FISH
    {
      name: "Thức Ăn Cá Koi",
      slug: "thuc-an-ca-koi",
      description: "Thức ăn dinh dưỡng cho cá koi.",
      price: 150000,
      discountPrice: 129000,
      stock: 45,
      sold: 70,
      images: [
        "https://cf.shopee.vn/file/ca-koi-food.jpg",
      ],
      category: fishCategory._id,
      petType: "fish",
      isFeatured: true,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.4,
    },

    // BIRD
    {
      name: "Hạt Dinh Dưỡng Cho Chim",
      slug: "hat-dinh-duong-cho-chim",
      description: "Hỗn hợp hạt cao cấp cho chim cảnh.",
      price: 89000,
      discountPrice: 69000,
      stock: 50,
      sold: 65,
      images: [
        "https://bizweb.dktcdn.net/100/094/710/products/thuc-an-cho-chim.jpg",
      ],
      category: birdCategory._id,
      petType: "bird",
      isFeatured: false,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.3,
    },

    // FOOD
    {
      name: "Snack Thưởng Cho Thú Cưng",
      slug: "snack-thuong-cho-thu-cung",
      description: "Snack thưởng thơm ngon cho thú cưng.",
      price: 55000,
      discountPrice: 45000,
      stock: 80,
      sold: 140,
      images: [
        "https://petmart.vn/wp-content/uploads/2021/03/snack-thuong.jpg",
      ],
      category: foodCategory._id,
      petType: "all",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.7,
    },
  ];

  await Product.insertMany(products);

  console.log("Seed products successfully");

  process.exit();
} catch (error) {
  console.log(error);
  process.exit();
}