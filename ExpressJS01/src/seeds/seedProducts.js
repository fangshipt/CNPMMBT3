import mongoose from "mongoose";

import Product from "../models/product.js";
import Category from "../models/category.js";

await mongoose.connect("mongodb://127.0.0.1:27017/petshop");

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

    // DOG PRODUCTS
    {
      name: "Áo Hoodie Cho Chó",
      slug: "ao-hoodie-cho-cho",
      description: "Áo hoodie dễ thương cho chó nhỏ.",
      price: 250000,
      discountPrice: 199000,
      stock: 20,
      sold: 50,
      images: ["/images/products/item1.png"],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.8,
    },

    {
      name: "Áo Len Pug",
      slug: "ao-len-pug",
      description: "Áo len giữ ấm cho chó pug.",
      price: 280000,
      discountPrice: 239000,
      stock: 15,
      sold: 40,
      images: ["/images/products/item2.png"],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.7,
    },

    {
      name: "Áo Hồng Thú Cưng",
      slug: "ao-hong-thu-cung",
      description: "Áo màu hồng phong cách cho thú cưng.",
      price: 220000,
      discountPrice: 180000,
      stock: 25,
      sold: 30,
      images: ["/images/products/item3.png"],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: false,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.5,
    },

    {
      name: "Đồ Chơi Cho Chó",
      slug: "do-choi-cho-cho",
      description: "Đồ chơi vận động cho chó.",
      price: 120000,
      discountPrice: 99000,
      stock: 35,
      sold: 70,
      images: ["/images/products/item4.png"],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.9,
    },

    {
      name: "Nhà Ngủ Thú Cưng",
      slug: "nha-ngu-thu-cung",
      description: "Nhà ngủ mini cho thú cưng.",
      price: 450000,
      discountPrice: 399000,
      stock: 10,
      sold: 18,
      images: ["/images/products/item5.png"],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.6,
    },

    // CAT PRODUCTS
    {
      name: "Pate Cá Hồi Cho Mèo",
      slug: "pate-ca-hoi-cho-meo",
      description: "Pate cá hồi dinh dưỡng cho mèo.",
      price: 45000,
      discountPrice: 39000,
      stock: 80,
      sold: 120,
      images: ["/images/products/item6.png"],
      category: catCategory._id,
      petType: "cat",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.9,
    },

    {
      name: "Áo Vàng Cho Mèo",
      slug: "ao-vang-cho-meo",
      description: "Áo thời trang cho mèo.",
      price: 180000,
      discountPrice: 150000,
      stock: 20,
      sold: 35,
      images: ["/images/products/item7.png"],
      category: catCategory._id,
      petType: "cat",
      isFeatured: false,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.4,
    },

    {
      name: "Áo Hoa Cho Cún",
      slug: "ao-hoa-cho-cun",
      description: "Áo phong cách mùa hè cho thú cưng.",
      price: 210000,
      discountPrice: 179000,
      stock: 18,
      sold: 26,
      images: ["/images/products/item8.png"],
      category: dogCategory._id,
      petType: "dog",
      isFeatured: true,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.5,
    },

    // FOOD PRODUCTS
    {
      name: "Snack Fresh Kisses",
      slug: "snack-fresh-kisses",
      description: "Snack thưởng thơm ngon cho thú cưng.",
      price: 89000,
      discountPrice: 69000,
      stock: 60,
      sold: 90,
      images: ["/images/products/item9.png"],
      category: foodCategory._id,
      petType: "all",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.8,
    },

    {
      name: "Pate Premium Cho Mèo",
      slug: "pate-premium-cho-meo",
      description: "Pate cao cấp dành cho mèo.",
      price: 55000,
      discountPrice: 49000,
      stock: 75,
      sold: 110,
      images: ["/images/products/item10.png"],
      category: catCategory._id,
      petType: "cat",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.9,
    },

    {
      name: "Treats Cho Thú Cưng",
      slug: "treats-cho-thu-cung",
      description: "Bánh thưởng dinh dưỡng cho thú cưng.",
      price: 65000,
      discountPrice: 52000,
      stock: 90,
      sold: 100,
      images: ["/images/products/item11.png"],
      category: foodCategory._id,
      petType: "all",
      isFeatured: false,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.6,
    },

    {
      name: "Pate Cá Ngừ",
      slug: "pate-ca-ngu",
      description: "Pate cá ngừ thơm ngon cho mèo.",
      price: 48000,
      discountPrice: 42000,
      stock: 70,
      sold: 95,
      images: ["/images/products/item12.png"],
      category: catCategory._id,
      petType: "cat",
      isFeatured: true,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.7,
    },

    {
      name: "Thức Ăn Organic",
      slug: "thuc-an-organic",
      description: "Thức ăn organic cho thú cưng.",
      price: 320000,
      discountPrice: 289000,
      stock: 22,
      sold: 48,
      images: ["/images/products/item13.png"],
      category: foodCategory._id,
      petType: "all",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.9,
    },

    {
      name: "Popcorn Snack",
      slug: "popcorn-snack",
      description: "Snack vị popcorn dành cho thú cưng.",
      price: 75000,
      discountPrice: 59000,
      stock: 55,
      sold: 65,
      images: ["/images/products/item14.png"],
      category: foodCategory._id,
      petType: "all",
      isFeatured: false,
      isBestSeller: false,
      isNewProduct: true,
      rating: 4.4,
    },

    {
      name: "Pate Beef Premium",
      slug: "pate-beef-premium",
      description: "Pate bò premium cho chó và mèo.",
      price: 52000,
      discountPrice: 45000,
      stock: 85,
      sold: 105,
      images: ["/images/products/item15.png"],
      category: foodCategory._id,
      petType: "all",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: false,
      rating: 4.8,
    },

    {
      name: "Biscuit Thưởng",
      slug: "biscuit-thuong",
      description: "Bánh biscuit thưởng cho thú cưng.",
      price: 58000,
      discountPrice: 49000,
      stock: 95,
      sold: 130,
      images: ["/images/products/item16.png"],
      category: foodCategory._id,
      petType: "all",
      isFeatured: true,
      isBestSeller: true,
      isNewProduct: true,
      rating: 4.9,
    },
  ];

  await Product.insertMany(products);

  console.log("Seed products successfully");

  process.exit();

} catch (error) {
  console.log(error);
  process.exit();
}