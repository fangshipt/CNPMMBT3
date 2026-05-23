/**
 * Chạy tất cả seed theo thứ tự:
 *   node --experimental-vm-modules src/seeds/seedAll.js
 *
 * Thứ tự: Categories → Users → Addresses → Products → Blogs → Promotions → Orders
 */
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const seeds = [
    "seedCategories.js",
    "seedUsers.js",
    "seedAddresses.js",
    "seedProducts.js",
    "seedBlogs.js",
    "seedPromotions.js",
    "seedOrders.js",
];

console.log("=== BẮT ĐẦU SEED DỮ LIỆU ===\n");

for (const seed of seeds) {
    const filePath = path.join(__dirname, seed);
    console.log(`▶ Đang chạy ${seed}...`);
    try {
        execSync(`node "${filePath}"`, { stdio: "inherit" });
        console.log(`✓ ${seed} hoàn thành\n`);
    } catch (err) {
        console.error(`✗ ${seed} thất bại: ${err.message}\n`);
        process.exit(1);
    }
}

console.log("=== SEED DỮ LIỆU HOÀN TẤT ===");
