import { useEffect, useState } from "react";
import banner1 from "../../assets/banner-img.png";
import banner2 from "../../assets/banner-img3.png";
import banner3 from "../../assets/banner-img4.png";

const slides = [
  {
    image: banner1,
    offer: "Ưu đãi 10 - 20%",
    title: "Chọn đồ dễ hơn cho",
    highlight: "bé cưng",
  },
  {
    image: banner2,
    offer: "Gợi ý mới mỗi tuần",
    title: "Món ngon lành cho",
    highlight: "bữa ăn nhỏ",
  },
  {
    image: banner3,
    offer: "Hàng mới về",
    title: "Phụ kiện xinh cho",
    highlight: "ngày thường",
  },
];

function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, 2500);

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
                key={slide.image}
                aria-hidden={activeSlide !== index}
              >
                <div className="row banner-content align-items-center">
                  <div className="img-wrapper col-md-5">
                    <img src={slide.image} alt="Banner thú cưng" className="img-fluid" />
                  </div>

                  <div className="content-wrapper col-md-7 p-5 mb-5">
                    <div className="secondary-font text-primary text-uppercase mb-4">
                      {slide.offer}
                    </div>

                    <h2 className="banner-title display-1 fw-normal">
                      {slide.title}{" "}
                      <span className="text-primary">{slide.highlight}</span>
                    </h2>

                    <a
                      href="#"
                      className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1"
                      tabIndex={activeSlide === index ? 0 : -1}
                    >
                      Mua ngay

                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="mb-1"
                      >
                        <use xlinkHref="#arrow-right"></use>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-slider-pagination mb-5">
            {slides.map((slide, index) => (
              <button
                className={`swiper-pagination-bullet ${
                  activeSlide === index ? "swiper-pagination-bullet-active" : ""
                }`}
                key={slide.highlight}
                type="button"
                aria-label={`Chuyển đến banner ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
