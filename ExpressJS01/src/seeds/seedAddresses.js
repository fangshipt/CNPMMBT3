import mongoose from "mongoose";
import User from "../models/user.js";
import Address from "../models/address.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

// Dữ liệu địa chỉ Việt Nam theo tỉnh/thành
const vnAddressData = [
    {
        province: "Hà Nội",
        districts: [
            { name: "Quận Hoàn Kiếm", wards: ["Phường Hàng Bạc", "Phường Hàng Bông", "Phường Tràng Tiền"] },
            { name: "Quận Đống Đa", wards: ["Phường Văn Miếu", "Phường Khâm Thiên", "Phường Hàng Bột"] },
            { name: "Quận Cầu Giấy", wards: ["Phường Dịch Vọng", "Phường Quan Hoa", "Phường Nghĩa Đô"] },
            { name: "Quận Hai Bà Trưng", wards: ["Phường Bạch Đằng", "Phường Thanh Lương", "Phường Trương Định"] },
        ],
    },
    {
        province: "TP. Hồ Chí Minh",
        districts: [
            { name: "Quận 1", wards: ["Phường Bến Nghé", "Phường Bến Thành", "Phường Phạm Ngũ Lão"] },
            { name: "Quận 3", wards: ["Phường Võ Thị Sáu", "Phường Nguyễn Cư Trinh", "Phường Phạm Ngũ Lão"] },
            { name: "Quận Bình Thạnh", wards: ["Phường 25", "Phường 26", "Phường Hiệp Bình Chánh"] },
            { name: "Quận Tân Bình", wards: ["Phường 1", "Phường 2", "Phường Phú Thọ Hòa"] },
        ],
    },
    {
        province: "Đà Nẵng",
        districts: [
            { name: "Quận Hải Châu", wards: ["Phường Hải Châu 1", "Phường Phước Ninh", "Phường Thạch Thang"] },
            { name: "Quận Thanh Khê", wards: ["Phường Thanh Khê Đông", "Phường Xuân Hà", "Phường Tân Chính"] },
        ],
    },
    {
        province: "Hải Phòng",
        districts: [
            { name: "Quận Hồng Bàng", wards: ["Phường Hoàng Văn Thụ", "Phường Minh Khai", "Phường Phan Bội Châu"] },
            { name: "Quận Ngô Quyền", wards: ["Phường Lạc Viên", "Phường Đông Khê", "Phường Máy Tơ"] },
        ],
    },
    {
        province: "Cần Thơ",
        districts: [
            { name: "Quận Ninh Kiều", wards: ["Phường An Hội", "Phường Tân An", "Phường Xuân Khánh"] },
            { name: "Quận Bình Thủy", wards: ["Phường Bình Thủy", "Phường An Thới", "Phường Long Tuyền"] },
        ],
    },
];

const streetNames = [
    "Nguyễn Trãi", "Lê Lợi", "Trần Phú", "Đinh Tiên Hoàng",
    "Hùng Vương", "Nguyễn Huệ", "Lý Thường Kiệt", "Hoàng Diệu",
    "Phan Chu Trinh", "Trần Hưng Đạo", "Ngô Quyền", "Bạch Đằng",
    "Nguyễn Văn Cừ", "Lê Duẩn", "Quang Trung", "Hai Bà Trưng",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

try {
    await Address.deleteMany();

    const users = await User.find({ role: "customer" });
    if (users.length === 0) {
        console.log("Không tìm thấy user. Hãy chạy seedUsers.js trước.");
        process.exit(1);
    }

    const addresses = [];

    for (const user of users) {
        const cityData = getRandom(vnAddressData);
        const districtData = getRandom(cityData.districts);
        const ward = getRandom(districtData.wards);
        const street = getRandom(streetNames);
        const houseNo = Math.floor(1 + Math.random() * 200);

        addresses.push({
            user: user._id,
            recipientName: user.fullName,
            phone: user.phone || `090${Math.floor(1000000 + Math.random() * 8999999)}`,
            province: cityData.province,
            district: districtData.name,
            ward,
            detail: `${houseNo} ${street}`,
            isDefault: true,
        });

        // Một số user có thêm địa chỉ phụ
        if (Math.random() > 0.5) {
            const city2 = getRandom(vnAddressData);
            const dist2 = getRandom(city2.districts);
            const ward2 = getRandom(dist2.wards);
            const street2 = getRandom(streetNames);
            const houseNo2 = Math.floor(1 + Math.random() * 200);

            addresses.push({
                user: user._id,
                recipientName: user.fullName,
                phone: user.phone || `090${Math.floor(1000000 + Math.random() * 8999999)}`,
                province: city2.province,
                district: dist2.name,
                ward: ward2,
                detail: `${houseNo2} ${street2}`,
                isDefault: false,
            });
        }
    }

    const created = await Address.insertMany(addresses);
    console.log(`Seeded ${created.length} addresses for ${users.length} users`);
    process.exit(0);
} catch (error) {
    console.error("Seed addresses error:", error);
    process.exit(1);
}
