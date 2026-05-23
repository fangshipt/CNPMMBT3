import mongoose from "mongoose";
import Blog from "../models/blog.js";
import User from "../models/user.js";

await mongoose.connect("mongodb://127.0.0.1:27017/fullstack02");

try {
    await Blog.deleteMany();

    const admin = await User.findOne({ role: "admin" });
    const authorId = admin?._id || null;

    const now = new Date();
    const daysAgo = (d) => new Date(now.getTime() - d * 24 * 3600000);

    const blogs = [
        {
            title: "Cách chăm sóc mèo con mới về nhà đúng cách",
            slug: "cach-cham-soc-meo-con-moi-ve-nha-dung-cach",
            excerpt: "Mèo con mới về nhà cần được chăm sóc đặc biệt trong những tuần đầu tiên. Hãy cùng tìm hiểu những điều cần biết để bé yêu phát triển khỏe mạnh.",
            content: `<h2>Chuẩn bị không gian sống cho mèo con</h2>
<p>Khi đón mèo con về nhà, điều đầu tiên bạn cần làm là chuẩn bị một không gian ấm áp, an toàn cho bé. Hãy chọn một góc nhỏ trong nhà, đặt nệm mềm hoặc chăn ấm để mèo có chỗ nghỉ ngơi riêng.</p>

<h2>Chế độ dinh dưỡng cho mèo con</h2>
<p>Mèo con dưới 8 tuần tuổi cần được bú sữa mẹ hoặc sữa thay thế chuyên dụng. Từ 8-12 tuần, có thể bắt đầu cho ăn thức ăn ướt (pate) kết hợp với sữa. Từ 12 tuần trở lên, mèo con có thể ăn hạt khô nhưng cần ngâm mềm trước.</p>

<h3>Lưu ý khi cho mèo ăn:</h3>
<ul>
  <li>Chia nhỏ bữa ăn, cho ăn 4-5 lần/ngày với mèo con</li>
  <li>Luôn có nước sạch bên cạnh</li>
  <li>Không cho mèo ăn thức ăn của người như hành, tỏi, chocolate</li>
</ul>

<h2>Tiêm phòng và khám sức khỏe định kỳ</h2>
<p>Mèo con cần được tiêm phòng các bệnh nguy hiểm như viêm ruột truyền nhiễm, herpes, calici từ 8-9 tuần tuổi. Lịch tiêm phòng sẽ được bác sĩ thú y tư vấn cụ thể.</p>

<h2>Xã hội hóa mèo con</h2>
<p>Giai đoạn 3-9 tuần tuổi là thời kỳ vàng để mèo học cách giao tiếp với người và các động vật khác. Hãy dành thời gian chơi đùa, vuốt ve và nói chuyện với mèo để bé quen với sự hiện diện của bạn.</p>`,
            image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
            author: authorId,
            isPublished: true,
            publishedAt: daysAgo(15),
        },
        {
            title: "5 giống chó phổ biến nhất phù hợp nuôi trong chung cư",
            slug: "5-giong-cho-pho-bien-nhat-phu-hop-nuoi-trong-chung-cu",
            excerpt: "Sống trong chung cư không có nghĩa là bạn không thể nuôi chó. Dưới đây là 5 giống chó hiền lành, ít짖 sủa và phù hợp với không gian nhỏ.",
            content: `<h2>1. Chó Poodle (Phu Quý)</h2>
<p>Poodle là lựa chọn hàng đầu cho người sống trong chung cư. Bé thông minh, dễ huấn luyện và ít rụng lông. Có 3 kích cỡ: Toy (dưới 4kg), Miniature (4-7kg) và Standard (trên 7kg).</p>

<h2>2. Chó Shih Tzu</h2>
<p>Shih Tzu có tính cách hiền lành, thân thiện với trẻ em và người già. Bé không cần vận động nhiều, thích hợp cho gia đình ít thời gian ra ngoài.</p>

<h2>3. Chó Corgi (Welsh Corgi)</h2>
<p>Dù có kích thước nhỏ đến trung bình, Corgi rất năng động và thông minh. Bé cần được vận động hàng ngày nhưng tính cách rất dễ chịu với gia đình.</p>

<h2>4. Chó Bichon Frise</h2>
<p>Bichon Frise có lông trắng xù, không gây dị ứng (ít rụng lông). Tính cách vui vẻ, thích chơi đùa và dễ thích nghi với không gian hẹp.</p>

<h2>5. Chó Maltese (Maltipoo)</h2>
<p>Maltese là giống chó cảnh nhỏ nhắn, nhẹ nhàng. Bé rất gắn bó với chủ và ít sủa, phù hợp cho môi trường chung cư.</p>

<h2>Lưu ý khi nuôi chó trong chung cư</h2>
<ul>
  <li>Kiểm tra quy định nuôi thú cưng của tòa nhà trước khi nuôi</li>
  <li>Đưa chó ra ngoài vận động ít nhất 2 lần/ngày</li>
  <li>Dọn vệ sinh thường xuyên để tránh mùi</li>
  <li>Không để chó làm phiền hàng xóm</li>
</ul>`,
            image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
            author: authorId,
            isPublished: true,
            publishedAt: daysAgo(8),
        },
        {
            title: "Hướng dẫn nuôi cá Koi cho người mới bắt đầu",
            slug: "huong-dan-nuoi-ca-koi-cho-nguoi-moi-bat-dau",
            excerpt: "Cá Koi không chỉ là thú cưng đẹp mắt mà còn mang lại may mắn theo quan niệm phong thủy. Hãy tìm hiểu cách nuôi cá Koi đúng cách.",
            content: `<h2>Tại sao nên nuôi cá Koi?</h2>
<p>Cá Koi (cá chép Nhật) được mệnh danh là "vua của loài cá cảnh" với màu sắc rực rỡ và tuổi thọ lên đến 30-40 năm. Chúng không chỉ đẹp mà còn tượng trưng cho may mắn, thịnh vượng trong văn hóa Á Đông.</p>

<h2>Chuẩn bị hồ nuôi</h2>
<p>Cá Koi cần không gian rộng để phát triển. Hồ nuôi cần đảm bảo:</p>
<ul>
  <li>Dung tích tối thiểu 1000L cho 1-2 con Koi trưởng thành</li>
  <li>Độ sâu ít nhất 1m để điều hòa nhiệt độ</li>
  <li>Hệ thống lọc nước mạnh (lưu lượng 2x thể tích hồ/giờ)</li>
  <li>Máy sục khí để đảm bảo oxy</li>
</ul>

<h2>Chất lượng nước</h2>
<p>Nước là yếu tố quan trọng nhất khi nuôi cá Koi. Các thông số cần kiểm tra định kỳ:</p>
<ul>
  <li>pH: 7.0 - 8.0</li>
  <li>Nhiệt độ: 15-25°C</li>
  <li>Amoniac (NH3): 0 ppm</li>
  <li>Nitrit (NO2): 0 ppm</li>
  <li>Nitrat (NO3): dưới 40 ppm</li>
</ul>

<h2>Chế độ ăn uống</h2>
<p>Cá Koi là loài ăn tạp, thích ăn nhất vào buổi sáng và chiều tối. Cho ăn 2-3 lần/ngày, lượng vừa đủ trong 5 phút là được. Không cho ăn quá nhiều vì thức ăn thừa sẽ làm ô nhiễm nước.</p>

<h2>Phòng bệnh thường gặp</h2>
<p>Một số bệnh phổ biến ở cá Koi là bệnh nấm, bệnh đốm trắng và ký sinh trùng. Duy trì chất lượng nước tốt và cách ly cá mới mua 2-3 tuần là biện pháp phòng bệnh hiệu quả nhất.</p>`,
            image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800",
            author: authorId,
            isPublished: true,
            publishedAt: daysAgo(3),
        },
        {
            title: "Dinh dưỡng cân bằng cho chó và mèo: Những điều bạn cần biết",
            slug: "dinh-duong-can-bang-cho-cho-va-meo-nhung-dieu-ban-can-biet",
            excerpt: "Chế độ dinh dưỡng đóng vai trò quyết định đến sức khỏe và tuổi thọ của thú cưng. Hãy tìm hiểu cách xây dựng thực đơn cân bằng cho bé.",
            content: `<h2>Tại sao dinh dưỡng quan trọng?</h2>
<p>Một chế độ ăn cân bằng giúp thú cưng duy trì cân nặng hợp lý, bộ lông bóng khỏe, hệ miễn dịch tốt và tuổi thọ cao. Ngược lại, ăn không đủ chất hoặc ăn sai có thể gây béo phì, bệnh thận, tiểu đường...</p>

<h2>Dinh dưỡng cho chó</h2>
<h3>Các chất dinh dưỡng thiết yếu:</h3>
<ul>
  <li><strong>Protein:</strong> 18-22% trong khẩu phần. Nguồn: thịt gà, bò, cá, trứng</li>
  <li><strong>Chất béo:</strong> 5-8%. Nguồn: dầu cá, mỡ động vật</li>
  <li><strong>Carbohydrate:</strong> 30-70%. Nguồn: gạo, khoai lang, rau xanh</li>
  <li><strong>Vitamin & Khoáng chất:</strong> Cần thiết cho xương, răng, thị giác</li>
</ul>

<h2>Dinh dưỡng cho mèo</h2>
<p>Mèo là động vật ăn thịt bắt buộc, cần protein cao hơn chó:</p>
<ul>
  <li><strong>Protein:</strong> ít nhất 26%. Mèo cần taurine (chỉ có trong thịt) để duy trì thị lực và tim khỏe</li>
  <li><strong>Arachidonic acid:</strong> Loại axit béo chỉ có trong thịt, mèo không tự tổng hợp được</li>
  <li><strong>Nước:</strong> Mèo thường không uống đủ nước, cần bổ sung qua thức ăn ướt (pate)</li>
</ul>

<h2>Thực phẩm cần tránh</h2>
<table>
  <tr><th>Thực phẩm</th><th>Tác hại</th></tr>
  <tr><td>Chocolate</td><td>Gây ngộ độc thần kinh, tim mạch</td></tr>
  <tr><td>Hành, tỏi</td><td>Phá hủy tế bào hồng cầu</td></tr>
  <tr><td>Nho, nho khô</td><td>Gây suy thận cấp</td></tr>
  <tr><td>Xylitol (trong kẹo cao su)</td><td>Hạ đường huyết nguy hiểm</td></tr>
  <tr><td>Xương nấu chín</td><td>Dễ vỡ, gây thủng ruột</td></tr>
</table>

<h2>Bao nhiêu là đủ?</h2>
<p>Lượng thức ăn phụ thuộc vào cân nặng, độ tuổi và mức độ vận động. Thông thường:</p>
<ul>
  <li>Chó nhỏ (dưới 5kg): 70-200g hạt khô/ngày</li>
  <li>Chó vừa (5-15kg): 200-400g/ngày</li>
  <li>Mèo trưởng thành: 40-80g hạt khô/ngày + 1-2 túi pate</li>
</ul>`,
            image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=800",
            author: authorId,
            isPublished: true,
            publishedAt: daysAgo(1),
        },
    ];

    const created = await Blog.insertMany(blogs);
    console.log(`Seeded ${created.length} blogs successfully`);
    process.exit(0);
} catch (error) {
    console.error("Seed blogs error:", error);
    process.exit(1);
}
