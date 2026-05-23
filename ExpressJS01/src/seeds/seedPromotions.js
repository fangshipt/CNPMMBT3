import mongoose from "mongoose";
import Promotion from "../models/promotion.js";
import Product from "../models/product.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

const daysFromNow = (d) => new Date(Date.now() + d * 24 * 3600000);
const daysAgo = (d) => new Date(Date.now() - d * 24 * 3600000);

try {
    await Promotion.deleteMany();

    // Reset all discountPrices first
    await Product.updateMany({}, { discountPrice: 0 });

    const dogProducts = await Product.find({ petType: "dog" });
    const catProducts = await Product.find({ petType: "cat" });
    const allProducts = await Product.find();
    const featuredProducts = await Product.find({ isFeatured: true });

    const promotions = [
        {
            name: "Tháng yêu thương thú cưng",
            description: "Ưu đãi đặc biệt dành cho tất cả sản phẩm nhân dịp tháng yêu thương thú cưng",
            type: "percent",
            value: 15,
            products: featuredProducts.map(p => p._id),
            startDate: daysAgo(2),
            endDate: daysFromNow(28),
            isActive: true,
        },
        {
            name: "Sale đồ dùng cho chó",
            description: "Giảm giá toàn bộ sản phẩm dành cho chó - Mua ngay kẻo hết!",
            type: "percent",
            value: 20,
            products: dogProducts.map(p => p._id),
            startDate: daysAgo(5),
            endDate: daysFromNow(10),
            isActive: true,
        },
        {
            name: "Ưu đãi đồ dùng mèo",
            description: "Giảm giá đặc biệt cho tất cả sản phẩm mèo nhân dịp cuối tuần",
            type: "percent",
            value: 10,
            products: catProducts.map(p => p._id),
            startDate: daysAgo(1),
            endDate: daysFromNow(7),
            isActive: true,
        },
        {
            name: "Khuyến mãi flash sale 24h",
            description: "Giảm ngay 50.000đ cho đơn hàng từ 200.000đ - Chỉ trong 24 giờ!",
            type: "fixed",
            value: 50000,
            products: allProducts.slice(0, 6).map(p => p._id),
            startDate: new Date(),
            endDate: daysFromNow(1),
            isActive: true,
        },
        {
            name: "Clearance sale cuối mùa",
            description: "Dọn kho cuối mùa - Giảm đến 30% cho sản phẩm tồn kho",
            type: "percent",
            value: 30,
            products: allProducts.filter(p => p.stock > 30).map(p => p._id),
            startDate: daysAgo(10),
            endDate: daysFromNow(5),
            isActive: true,
        },
    ];

    for (const promo of promotions) {
        // Tính và cập nhật discountPrice cho từng sản phẩm
        for (const productId of promo.products) {
            const product = await Product.findById(productId);
            if (!product) continue;
            let discountPrice;
            if (promo.type === "percent") {
                discountPrice = Math.round(product.price * (1 - promo.value / 100));
            } else {
                discountPrice = Math.max(0, product.price - promo.value);
            }
            await Product.findByIdAndUpdate(productId, { discountPrice });
        }
    }

    const created = await Promotion.insertMany(promotions);
    const totalDiscounted = await Product.countDocuments({ discountPrice: { $gt: 0 } });

    console.log(`Seeded ${created.length} promotions`);
    console.log(`${totalDiscounted} products now have discounts`);
    process.exit(0);
} catch (error) {
    console.error("Seed promotions error:", error);
    process.exit(1);
}
