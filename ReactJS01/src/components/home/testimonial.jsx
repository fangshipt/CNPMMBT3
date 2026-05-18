import reviewer1 from "../../assets/reviewer-1.jpg";
import reviewer2 from "../../assets/reviewer-2.jpg";
import reviewer3 from "../../assets/reviewer-3.jpg";

const reviews = [
  {
    name: "Chị Mai",
    location: "Quận 7, TP. Hồ Chí Minh",
    image: reviewer1,
    content:
      "Mình đặt đồ ăn cho bé Mít vài lần rồi, giao nhanh và đóng gói cẩn thận. Bé ăn hợp nên mình yên tâm đặt tiếp.",
  },
  {
    name: "Anh Dũng",
    location: "Cầu Giấy, Hà Nội",
    image: reviewer2,
    content:
      "Shop tư vấn dễ hiểu, không cố bán món đắt tiền. Mình thích nhất là cách gợi ý đồ phù hợp với cân nặng của bé.",
  },
  {
    name: "Bạn Linh",
    location: "Đà Nẵng",
    image: reviewer3,
    content:
      "Đồ chơi và phụ kiện nhìn xinh, giá ổn. Nhận hàng thấy giống hình, bé Cún nhà mình mê cái vòng cổ mới lắm.",
  },
];

function Testimonial() {
  return (
    <section id="testimonial" className="testimonial-section">
      <div className="container my-5 py-5">
        <div className="section-header text-center mb-5">
          <p className="secondary-font text-primary text-uppercase mb-2">
            Khách hàng chia sẻ
          </p>
          <h2 className="display-4 fw-normal mb-3">
            Những lời nhắn nhỏ từ người nuôi thú cưng
          </h2>
          <p className="testimonial-intro secondary-font mx-auto">
            Tụi mình luôn muốn mỗi đơn hàng đến tay bạn thật gọn gàng, dễ chọn
            và hợp với thói quen chăm sóc các bé ở Việt Nam.
          </p>
        </div>

        <div className="row g-4">
          {reviews.map((review) => (
            <div className="col-md-4" key={review.name}>
              <article className="testimonial-card h-100">
                <div className="testimonial-rating mb-3" aria-label="5 sao">
                  ★★★★★
                </div>

                <p className="testimonial-content">"{review.content}"</p>

                <div className="testimonial-author">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="testimonial-avatar"
                  />
                  <div>
                    <h3 className="testimonial-name mb-0">{review.name}</h3>
                    <p className="testimonial-location secondary-font mb-0">
                      {review.location}
                    </p>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
