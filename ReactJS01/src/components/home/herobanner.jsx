import { useEffect, useState } from "react";
import banner1 from "../../assets/banner-img.png";
import banner2 from "../../assets/banner-img3.png";
import banner3 from "../../assets/banner-img4.png";

const slides = [
  {
    image: banner1,
    tag: "Dành cho thú cưng của bạn",
    title: "Mọi thứ bạn cần,",
    highlight: "đều ở đây",
    desc: "Từ thức ăn đến phụ kiện — luôn được chọn lọc kỹ.",
  },
  {
    image: banner2,
    tag: "Dinh dưỡng & sức khỏe",
    title: "Bữa ăn ngon cho",
    highlight: "những người bạn nhỏ",
    desc: "Thực phẩm chất lượng, phù hợp từng giống loài — vì sức khỏe cho thú cưng của bạn.",
  },
  {
    image: banner3,
    tag: "Phụ kiện & đồ chơi",
    title: "Những khoảnh khắc vui",
    highlight: "bên thú cưng mỗi ngày",
    desc: "Đồ chơi, vòng cổ, áo quần.",
  },
];

function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((cur) => (cur + 1) % slides.length);
    }, 3500);
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <section id="banner" style={{ background: "#F9F3EC" }}>
      <div className="container">
        <div className="hero-slider">
          <div className="hero-slider-track">
            {slides.map((slide, index) => (
              <div
                className={`hero-slide py-5 ${activeSlide === index ? "active" : ""}`}
                key={index}
                aria-hidden={activeSlide !== index}
              >
                <div className="row banner-content items-center">
                  <div className="img-wrapper col-md-5">
                    <img src={slide.image} alt="Banner thú cưng" className="img-fluid" />
                  </div>

                  <div className="content-wrapper col-md-7 p-5 mb-5">
                    <div className="secondary-font text-primary uppercase mb-4 text-sm tracking-widest">
                      {slide.tag}
                    </div>

                    <h2 className="banner-title display-1 font-normal mb-3">
                      {slide.title}{" "}
                      <span className="text-primary">{slide.highlight}</span>
                    </h2>

                    <p className="mt-2 text-base leading-[1.7] max-w-[420px]" style={{ color: "#6b5a4e" }}>
                      {slide.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-slider-pagination mb-5">
            {slides.map((_, index) => (
              <button
                className={`swiper-pagination-bullet ${
                  activeSlide === index ? "swiper-pagination-bullet-active" : ""
                }`}
                key={index}
                type="button"
                aria-label={`Chuyển đến banner ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;

