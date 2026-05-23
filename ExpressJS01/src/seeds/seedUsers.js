import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

const hashedPassword = await bcrypt.hash("123456789", 10);

const vietnameseUsers = [
    { fullName: "Nguyễn Phương Anh", email: "phuonganh@gmail.com" },
    { fullName: "Trần Minh Quân", email: "minhquan@gmail.com" },
    { fullName: "Lê Thị Hồng Nhung", email: "hongnhung@gmail.com" },
    { fullName: "Phạm Văn Đức", email: "vanduc@gmail.com" },
    { fullName: "Hoàng Thị Mai Linh", email: "mailinh@gmail.com" },
    { fullName: "Vũ Thanh Tùng", email: "thanhtung@gmail.com" },
    { fullName: "Đặng Thị Thu Hà", email: "thuha@gmail.com" },
    { fullName: "Bùi Quốc Hùng", email: "quochung@gmail.com" },
    { fullName: "Ngô Thị Bảo Châu", email: "baochau@gmail.com" },
    { fullName: "Dương Văn Khải", email: "vankhai@gmail.com" },
    { fullName: "Đinh Thị Lan Anh", email: "lananh@gmail.com" },
    { fullName: "Tô Minh Đức", email: "minhduc@gmail.com" },
    { fullName: "Trịnh Thị Ngọc Ánh", email: "ngocanh@gmail.com" },
    { fullName: "Lý Thành Nhân", email: "thanhnhan@gmail.com" },
    { fullName: "Cao Thị Mỹ Duyên", email: "myduyen@gmail.com" },
    { fullName: "Hồ Văn Phúc", email: "vanphuc@gmail.com" },
    { fullName: "Mai Thị Kim Oanh", email: "kimoanh@gmail.com" },
    { fullName: "Nguyễn Trung Kiên", email: "trungkien@gmail.com" },
    { fullName: "Phan Thị Yến Nhi", email: "yennhi@gmail.com" },
    { fullName: "Lưu Văn Tài", email: "vantai@gmail.com" },
];

try {
    await User.deleteMany({});

    // Tài khoản admin
    const adminUser = {
        fullName: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
        phone: "0900000000",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
    };

    const customerUsers = vietnameseUsers.map(u => ({
        fullName: u.fullName,
        email: u.email,
        password: hashedPassword,
        role: "customer",
        phone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(u.fullName)}`,
    }));

    const created = await User.insertMany([adminUser, ...customerUsers]);
    console.log(`Seeded ${created.length} users (1 admin + ${customerUsers.length} customers)`);
    process.exit(0);
} catch (error) {
    console.error("Seed users error:", error);
    process.exit(1);
}
