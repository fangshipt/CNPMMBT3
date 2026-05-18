import blog1 from "../../assets/blog1.jpg";
import blog2 from "../../assets/blog2.jpg";
import blog3 from "../../assets/blog3.jpg";

const posts = [
  {
    id: 1,
    day: "20",
    month: "Th2",
    image: blog1,
    title: "10 cách nhỏ để chăm bé cưng vui khỏe hơn",
    excerpt:
      "Chỉ cần vài thói quen đơn giản mỗi ngày, bạn đã có thể giúp bé ăn ngon, ngủ yên và thấy an toàn hơn trong nhà.",
  },
  {
    id: 2,
    day: "21",
    month: "Th2",
    image: blog2,
    title: "Làm sao biết bé đang đói hoặc cần đổi bữa?",
    excerpt:
      "Một vài dấu hiệu rất dễ nhận ra sẽ giúp bạn chọn khẩu phần, món ăn và giờ ăn phù hợp hơn cho từng bé.",
  },
  {
    id: 3,
    day: "22",
    month: "Th2",
    image: blog3,
    title: "Góc nằm êm ái giúp bé thấy nhà là nơi an toàn",
    excerpt:
      "Một chiếc ổ nhỏ, sạch và yên tĩnh có thể làm bé bớt căng thẳng, đặc biệt khi mới về nhà hoặc vừa đổi môi trường.",
  },
];

function BlogSection() {
  return (
    <section id="latest-blog" className="my-5">
      <div className="container py-5 my-5">
        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
          <h2 className="display-3 fw-normal">Bài viết mới nhất</h2>

          <div>
            <a href="#" className="btn btn-outline-dark btn-lg rounded-1">
              Xem tất cả
              <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </a>
          </div>
        </div>

        <div className="row">
          {posts.map((post) => (
            <div className="col-md-4 my-4 my-md-0" key={post.id}>
              <article className="card blog-card position-relative h-100">
                <div className="blog-date position-absolute">
                  <h3 className="secondary-font text-primary m-0">{post.day}</h3>
                  <p className="secondary-font fs-6 m-0">{post.month}</p>
                </div>

                <a href="#">
                  <img
                    src={post.image}
                    className="img-fluid rounded-4 blog-image"
                    alt={post.title}
                  />
                </a>

                <div className="card-body p-0">
                  <a href="#">
                    <h3 className="card-title pt-4 pb-3 m-0">
                      {post.title}
                    </h3>
                  </a>

                  <div className="card-text">
                    <p className="blog-paragraph fs-6">{post.excerpt}</p>
                    <a href="#" className="blog-read">
                      Đọc tiếp
                    </a>
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

export default BlogSection;
