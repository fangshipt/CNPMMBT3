import mongoose from "mongoose";
import Product from "../models/product.js";
import Category from "../models/category.js";
import User from "../models/user.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

try {
    await Product.deleteMany();

    const dogCat = await Category.findOne({ slug: "cho-cho" });
    const catCat = await Category.findOne({ slug: "cho-meo" });
    const fishCat = await Category.findOne({ slug: "cho-ca" });
    const birdCat = await Category.findOne({ slug: "cho-chim" });
    const foodCat = await Category.findOne({ slug: "thuc-an" });

    if (!dogCat || !catCat || !fishCat || !birdCat || !foodCat) {
        console.error("Không tìm thấy đủ categories. Hãy chạy seedCategories.js trước.");
        process.exit(1);
    }

    const users = await User.find({ role: "customer" }).limit(10);

    const makeReviews = (count, maxRating = 5) => {
        const reviews = [];
        const pool = [...users];
        for (let i = 0; i < Math.min(count, pool.length); i++) {
            const idx = Math.floor(Math.random() * pool.length);
            const user = pool.splice(idx, 1)[0];
            const rating = Math.min(maxRating, Math.max(1, Math.floor(3 + Math.random() * 3)));
            const comments = [
                "Sản phẩm rất tốt, thú cưng của mình thích lắm!",
                "Giao hàng nhanh, đóng gói cẩn thận.",
                "Chất lượng đúng như mô tả, sẽ mua lại.",
                "Mèo nhà mình ăn ngon, không bỏ bữa nữa!",
                "Chó nhà mình rất thích, đuôi quẫy cả buổi.",
                "Hàng chính hãng, giá hợp lý.",
                "Sản phẩm tốt nhưng giao hơi chậm.",
                "Rất hài lòng với chất lượng sản phẩm.",
            ];
            reviews.push({
                user: user._id,
                rating,
                comment: comments[Math.floor(Math.random() * comments.length)],
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 3600000),
            });
        }
        return reviews;
    };

    const products = [
        // ===== CHÓ =====
        {
            name: "Hạt Royal Canin Mini Adult 2kg",
            slug: "hat-royal-canin-mini-adult-2kg",
            description: "Thức ăn hạt cao cấp dành cho chó nhỏ trưởng thành dưới 10kg. Bổ sung đầy đủ dưỡng chất, tốt cho xương khớp và lông.",
            price: 450000,
            discountPrice: 399000,
            stock: 35,
            sold: 256,
            views: 1820,
            images: ["https://product.hstatic.net/200000263355/product/royal-canin-mini-adult-2kg_1024x1024.png"],
            category: dogCat._id,
            petType: "dog",
            isFeatured: true,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.8,
            reviews: makeReviews(6),
        },
        {
            name: "Pate SmartHeart Gold Chó 400g",
            slug: "pate-smartheart-gold-cho-400g",
            description: "Pate mềm thơm ngon dành cho chó mọi lứa tuổi. Giàu protein, dễ tiêu hóa.",
            price: 35000,
            discountPrice: 29000,
            stock: 120,
            sold: 430,
            views: 2350,
            images: ["https://bizweb.dktcdn.net/100/307/433/products/pate-smartheart-gold.jpg"],
            category: dogCat._id,
            petType: "dog",
            isFeatured: true,
            isBestSeller: true,
            isNewProduct: true,
            rating: 4.6,
            reviews: makeReviews(5),
        },
        {
            name: "Vòng cổ da cho chó size M",
            slug: "vong-co-da-cho-cho-size-m",
            description: "Vòng cổ da bò thật, khóa inox bền chắc. Phù hợp chó cỡ vừa.",
            price: 95000,
            discountPrice: 0,
            stock: 50,
            sold: 88,
            views: 650,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/06/vong-co-da-cho-cho.jpg"],
            category: dogCat._id,
            petType: "dog",
            isFeatured: false,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.3,
            reviews: makeReviews(3),
        },
        {
            name: "Đồ chơi bóng cao su cho chó",
            slug: "do-choi-bong-cao-su-cho-cho",
            description: "Bóng cao su an toàn, màu sắc bắt mắt. Giúp chó vận động và giải trí.",
            price: 55000,
            discountPrice: 45000,
            stock: 80,
            sold: 175,
            views: 980,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/06/bong-cao-su-cho-cho.jpg"],
            category: dogCat._id,
            petType: "dog",
            isFeatured: false,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.5,
            reviews: makeReviews(4),
        },
        {
            name: "Sữa tắm cho chó Fay 350ml",
            slug: "sua-tam-cho-cho-fay-350ml",
            description: "Sữa tắm chuyên dụng cho chó, khử mùi, dưỡng lông bóng mượt. Thành phần tự nhiên an toàn.",
            price: 75000,
            discountPrice: 65000,
            stock: 60,
            sold: 210,
            views: 1450,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/07/sua-tam-fay-cho-cho.jpg"],
            category: dogCat._id,
            petType: "dog",
            isFeatured: true,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.7,
            reviews: makeReviews(5),
        },

        // ===== MÈO =====
        {
            name: "Hạt Catsrang Cho Mèo 1.5kg",
            slug: "hat-catsrang-cho-meo-1-5kg",
            description: "Hạt thức ăn dinh dưỡng dành cho mèo trưởng thành. Bổ sung taurine và omega-3 tốt cho tim mạch.",
            price: 320000,
            discountPrice: 279000,
            stock: 45,
            sold: 312,
            views: 2100,
            images: ["https://bizweb.dktcdn.net/100/421/124/products/catsrang.jpg"],
            category: catCat._id,
            petType: "cat",
            isFeatured: true,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.9,
            reviews: makeReviews(7),
        },
        {
            name: "Pate Whiskas Cho Mèo 85g",
            slug: "pate-whiskas-cho-meo-85g",
            description: "Pate cá ngừ thơm ngon cho mèo. Cung cấp đủ dinh dưỡng cho bữa ăn hàng ngày.",
            price: 18000,
            discountPrice: 15000,
            stock: 200,
            sold: 560,
            views: 3200,
            images: ["https://bizweb.dktcdn.net/100/307/433/products/pate-whiskas.jpg"],
            category: catCat._id,
            petType: "cat",
            isFeatured: true,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.7,
            reviews: makeReviews(8),
        },
        {
            name: "Cát vệ sinh Bioline cho mèo 5L",
            slug: "cat-ve-sinh-bioline-cho-meo-5l",
            description: "Cát vệ sinh vón cục, khử mùi tốt. Không gây bụi, an toàn cho mèo.",
            price: 120000,
            discountPrice: 99000,
            stock: 70,
            sold: 145,
            views: 890,
            images: ["https://petmart.vn/wp-content/uploads/2020/07/cat-ve-sinh-meo.jpg"],
            category: catCat._id,
            petType: "cat",
            isFeatured: false,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.5,
            reviews: makeReviews(4),
        },
        {
            name: "Nhà mèo gỗ nhiều tầng",
            slug: "nha-meo-go-nhieu-tang",
            description: "Nhà gỗ nhiều tầng cho mèo leo trèo và nghỉ ngơi. Chất liệu gỗ MDF an toàn.",
            price: 850000,
            discountPrice: 720000,
            stock: 15,
            sold: 42,
            views: 1580,
            images: ["https://petmart.vn/wp-content/uploads/2021/10/nha-meo-go.jpg"],
            category: catCat._id,
            petType: "cat",
            isFeatured: true,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.6,
            reviews: makeReviews(3),
        },
        {
            name: "Snack thưởng Temptations cho mèo 85g",
            slug: "snack-thuong-temptations-cho-meo-85g",
            description: "Snack giòn tan dành cho mèo. Vị cá hồi hấp dẫn, phù hợp làm phần thưởng.",
            price: 65000,
            discountPrice: 55000,
            stock: 95,
            sold: 380,
            views: 2650,
            images: ["https://petmart.vn/wp-content/uploads/2021/03/snack-temptations.jpg"],
            category: catCat._id,
            petType: "cat",
            isFeatured: true,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.8,
            reviews: makeReviews(6),
        },

        // ===== CÁ =====
        {
            name: "Thức ăn cá Koi Hikari 500g",
            slug: "thuc-an-ca-koi-hikari-500g",
            description: "Thức ăn cao cấp dành cho cá Koi. Tăng màu sắc, tăng sức đề kháng.",
            price: 180000,
            discountPrice: 149000,
            stock: 55,
            sold: 95,
            views: 740,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/08/thuc-an-ca-koi-hikari.jpg"],
            category: fishCat._id,
            petType: "fish",
            isFeatured: true,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.4,
            reviews: makeReviews(3),
        },
        {
            name: "Lọc bể cá Sunsun HW-702",
            slug: "loc-be-ca-sunsun-hw-702",
            description: "Máy lọc ngoài thùng cho bể cá 100-300L. Lọc 3 giai đoạn, hoạt động êm.",
            price: 650000,
            discountPrice: 0,
            stock: 20,
            sold: 38,
            views: 980,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/05/loc-ca-sunsun.jpg"],
            category: fishCat._id,
            petType: "fish",
            isFeatured: false,
            isBestSeller: false,
            isNewProduct: false,
            rating: 4.3,
            reviews: makeReviews(2),
        },
        {
            name: "Sỏi trang trí bể cá nhiều màu 1kg",
            slug: "soi-trang-tri-be-ca-nhieu-mau-1kg",
            description: "Sỏi màu trang trí bể cá, an toàn cho cá. Nhiều màu sắc bắt mắt.",
            price: 35000,
            discountPrice: 28000,
            stock: 100,
            sold: 155,
            views: 620,
            images: ["https://www.petmart.vn/wp-content/uploads/2020/11/soi-be-ca.jpg"],
            category: fishCat._id,
            petType: "fish",
            isFeatured: false,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.2,
            reviews: makeReviews(3),
        },

        // ===== CHIM =====
        {
            name: "Hạt hướng dương cho vẹt 500g",
            slug: "hat-huong-duong-cho-vet-500g",
            description: "Hạt hướng dương rang giòn dành cho vẹt và chim cảnh. Giàu chất béo tốt.",
            price: 45000,
            discountPrice: 38000,
            stock: 80,
            sold: 120,
            views: 560,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/06/hat-huong-duong-chim.jpg"],
            category: birdCat._id,
            petType: "bird",
            isFeatured: false,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.3,
            reviews: makeReviews(2),
        },
        {
            name: "Lồng chim inox tròn 40cm",
            slug: "long-chim-inox-tron-40cm",
            description: "Lồng chim inox chống gỉ sét. Thiết kế đẹp, dễ vệ sinh.",
            price: 280000,
            discountPrice: 240000,
            stock: 25,
            sold: 65,
            views: 870,
            images: ["https://www.petmart.vn/wp-content/uploads/2021/07/long-chim-inox.jpg"],
            category: birdCat._id,
            petType: "bird",
            isFeatured: true,
            isBestSeller: false,
            isNewProduct: false,
            rating: 4.6,
            reviews: makeReviews(3),
        },
        {
            name: "Hỗn hợp hạt dinh dưỡng cho chim cảnh 1kg",
            slug: "hon-hop-hat-dinh-duong-cho-chim-canh-1kg",
            description: "Hỗn hợp nhiều loại hạt cho chim cảnh. Cân đối dinh dưỡng, kích thích chim hót.",
            price: 89000,
            discountPrice: 72000,
            stock: 60,
            sold: 88,
            views: 490,
            images: ["https://bizweb.dktcdn.net/100/094/710/products/thuc-an-cho-chim.jpg"],
            category: birdCat._id,
            petType: "bird",
            isFeatured: false,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.3,
            reviews: makeReviews(2),
        },

        // ===== THỨC ĂN (chung) =====
        {
            name: "Snack xương nhai cho chó 10 cái",
            slug: "snack-xuong-nhai-cho-cho-10-cai",
            description: "Xương nhai làm sạch răng cho chó. Giúp giảm cao răng và hôi miệng.",
            price: 75000,
            discountPrice: 62000,
            stock: 90,
            sold: 220,
            views: 1650,
            images: ["https://petmart.vn/wp-content/uploads/2021/03/snack-xuong-nhai.jpg"],
            category: foodCat._id,
            petType: "dog",
            isFeatured: true,
            isBestSeller: true,
            isNewProduct: true,
            rating: 4.7,
            reviews: makeReviews(5),
        },
        {
            name: "Thức ăn tổng hợp cho thú cưng nhỏ 500g",
            slug: "thuc-an-tong-hop-cho-thu-cung-nho-500g",
            description: "Thức ăn dinh dưỡng cho nhiều loại thú cưng nhỏ: chuột hamster, thỏ, bọ rùa.",
            price: 55000,
            discountPrice: 45000,
            stock: 75,
            sold: 138,
            views: 720,
            images: ["https://petmart.vn/wp-content/uploads/2021/03/snack-thuong.jpg"],
            category: foodCat._id,
            petType: "all",
            isFeatured: false,
            isBestSeller: true,
            isNewProduct: false,
            rating: 4.5,
            reviews: makeReviews(4),
        },
        {
            name: "Vitamin tổng hợp cho thú cưng 60 viên",
            slug: "vitamin-tong-hop-cho-thu-cung-60-vien",
            description: "Viên uống bổ sung vitamin và khoáng chất cho chó, mèo. Tăng đề kháng, đẹp lông.",
            price: 220000,
            discountPrice: 185000,
            stock: 40,
            sold: 92,
            views: 1120,
            images: ["https://petmart.vn/wp-content/uploads/2021/09/vitamin-thu-cung.jpg"],
            category: foodCat._id,
            petType: "all",
            isFeatured: true,
            isBestSeller: false,
            isNewProduct: true,
            rating: 4.6,
            reviews: makeReviews(4),
        },
    ];

    // Tính rating từ reviews
    const productsWithRating = products.map(p => {
        if (p.reviews && p.reviews.length > 0) {
            const total = p.reviews.reduce((s, r) => s + r.rating, 0);
            p.rating = Math.round((total / p.reviews.length) * 10) / 10;
        }
        return p;
    });

    const created = await Product.insertMany(productsWithRating);
    console.log(`Seeded ${created.length} products successfully`);
    process.exit(0);
} catch (error) {
    console.error("Seed products error:", error);
    process.exit(1);
}
