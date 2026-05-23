import mongoose from "mongoose";
import User from "../models/user.js";
import Product from "../models/product.js";
import Address from "../models/address.js";
import Order from "../models/order.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const generateOrderCode = (index, date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(2);
    const seq = String(index).padStart(4, '0');
    return `FS${dd}${mm}${yy}${seq}`;
};

const statusFlow = [
    ['delivered'],
    ['delivered'],
    ['delivered'],
    ['cancelled'],
    ['pending'],
    ['confirmed'],
    ['preparing'],
    ['shipping'],
];

try {
    await Order.deleteMany();

    const users = await User.find({ role: "customer" });
    const products = await Product.find({ isActive: true });
    const addresses = await Address.find();

    if (users.length === 0 || products.length === 0) {
        console.error("Cần chạy seedUsers.js và seedProducts.js trước.");
        process.exit(1);
    }

    const orders = [];
    let orderIndex = 1;

    for (const user of users) {
        const userAddresses = addresses.filter(a => a.user.toString() === user._id.toString());
        if (userAddresses.length === 0) continue;

        const addr = getRandom(userAddresses);
        const numOrders = getRandomInt(1, 4);

        for (let i = 0; i < numOrders; i++) {
            const statusHistory = getRandom(statusFlow);
            const status = statusHistory[statusHistory.length - 1];

            const numItems = getRandomInt(1, 3);
            const selectedProducts = [];
            const usedIds = new Set();
            for (let j = 0; j < numItems; j++) {
                let p;
                let attempts = 0;
                do {
                    p = getRandom(products);
                    attempts++;
                } while (usedIds.has(p._id.toString()) && attempts < 20);
                usedIds.add(p._id.toString());
                selectedProducts.push(p);
            }

            const items = selectedProducts.map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '',
                price: p.discountPrice > 0 ? p.discountPrice : p.price,
                quantity: getRandomInt(1, 3),
            }));

            const totalAmount = items.reduce((s, it) => s + it.price * it.quantity, 0);
            const shippingFee = totalAmount > 300000 ? 0 : 30000;

            const createdAt = new Date(Date.now() - getRandomInt(1, 60) * 24 * 3600000);

            const statusHistoryArr = [{ status: 'pending', note: 'Đơn hàng được tạo', createdAt }];
            const flow = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered'];
            const targetIdx = flow.indexOf(status);
            for (let si = 1; si <= targetIdx; si++) {
                statusHistoryArr.push({
                    status: flow[si],
                    note: `Chuyển sang ${flow[si]}`,
                    createdAt: new Date(createdAt.getTime() + si * 3600000),
                });
            }
            if (status === 'cancelled') {
                statusHistoryArr.push({ status: 'cancelled', note: 'Đơn hàng đã hủy', createdAt: new Date(createdAt.getTime() + 3600000) });
            }

            orders.push({
                orderCode: generateOrderCode(orderIndex++, createdAt),
                user: user._id,
                items,
                shippingAddress: {
                    recipientName: addr.recipientName,
                    phone: addr.phone,
                    province: addr.province,
                    district: addr.district,
                    ward: addr.ward,
                    detail: addr.detail,
                },
                paymentMethod: 'COD',
                totalAmount: totalAmount + shippingFee,
                shippingFee,
                status,
                notes: '',
                statusHistory: statusHistoryArr,
                createdAt,
                updatedAt: statusHistoryArr[statusHistoryArr.length - 1].createdAt,
            });
        }
    }

    const created = await Order.insertMany(orders);

    // Cập nhật sold count cho sản phẩm trong đơn đã giao
    const deliveredOrders = created.filter(o => o.status === 'delivered');
    for (const order of deliveredOrders) {
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { sold: item.quantity } });
        }
    }

    console.log(`Seeded ${created.length} orders (${deliveredOrders.length} delivered)`);
    process.exit(0);
} catch (error) {
    console.error("Seed orders error:", error);
    process.exit(1);
}
