import item1 from "../../assets/item1.jpg";
import item2 from "../../assets/item2.jpg";
import item3 from "../../assets/item3.jpg";
import item4 from "../../assets/item4.jpg";
import item7 from "../../assets/item7.jpg";
import item8 from "../../assets/item8.jpg";

function Clothing() {
  return (
    <section id="clothing" className="my-5 overflow-hidden">
      <div className="container pb-5">

        {/* Section Header */}
        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">

          <h2 className="display-3 fw-normal">
            Trang phục thú cưng
          </h2>

          <div>
            <a
              href="#"
              className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1"
            >
              Xem thêm

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

        {/* Products Carousel */}
        <div className="products-carousel swiper">
          <div className="swiper-wrapper">

            {/* Product 1 */}
            <div className="swiper-slide">

              <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                Mới
              </div>

              <div className="card position-relative">

                <a href="single-product.html">
                  <img
                    src={item1}
                    className="img-fluid rounded-4"
                    alt="Áo thú cưng"
                  />
                </a>

                <div className="card-body p-0">

                  <a href="single-product.html">
                    <h3 className="card-title pt-4 m-0">
                      Áo hoodie xám
                    </h3>
                  </a>

                  <div className="card-text">

                    <span className="rating secondary-font">
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      {" "}5.0
                    </span>

                    <h3 className="secondary-font text-primary">
                      129.000đ
                    </h3>

                    <div className="d-flex flex-wrap mt-3">

                      <a
                        href="#"
                        className="btn-cart me-3 px-4 pt-3 pb-3"
                      >
                        <h5 className="text-uppercase m-0">
                          Thêm vào giỏ
                        </h5>
                      </a>

                      <a
                        href="#"
                        className="btn-wishlist px-4 pt-3"
                      >
                        <iconify-icon
                          icon="fluent:heart-28-filled"
                          class="fs-5"
                        ></iconify-icon>
                      </a>

                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="swiper-slide">
              <div className="card position-relative">

                <a href="single-product.html">
                  <img
                    src={item2}
                    className="img-fluid rounded-4"
                    alt="Áo thú cưng"
                  />
                </a>

                <div className="card-body p-0">

                  <a href="single-product.html">
                    <h3 className="card-title pt-4 m-0">
                      Áo hoodie xám
                    </h3>
                  </a>

                  <div className="card-text">

                    <span className="rating secondary-font">
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      {" "}5.0
                    </span>

                    <h3 className="secondary-font text-primary">
                      129.000đ
                    </h3>

                  </div>

                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="swiper-slide">

              <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                -10%
              </div>

              <div className="card position-relative">

                <a href="single-product.html">
                  <img
                    src={item3}
                    className="img-fluid rounded-4"
                    alt="Áo thú cưng"
                  />
                </a>

                <div className="card-body p-0">

                  <a href="single-product.html">
                    <h3 className="card-title pt-4 m-0">
                      Áo hoodie xám
                    </h3>
                  </a>

                  <div className="card-text">

                    <span className="rating secondary-font">
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      {" "}5.0
                    </span>

                    <h3 className="secondary-font text-primary">
                      129.000đ
                    </h3>

                  </div>

                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="swiper-slide">
              <div className="card position-relative">

                <a href="single-product.html">
                  <img
                    src={item4}
                    className="img-fluid rounded-4"
                    alt="Áo thú cưng"
                  />
                </a>

                <div className="card-body p-0">
                  <a href="single-product.html">
                    <h3 className="card-title pt-4 m-0">
                      Áo hoodie xám
                    </h3>
                  </a>
                </div>

              </div>
            </div>

            {/* Product 5 */}
            <div className="swiper-slide">
              <div className="card position-relative">

                <a href="single-product.html">
                  <img
                    src={item7}
                    className="img-fluid rounded-4"
                    alt="Áo thú cưng"
                  />
                </a>

                <div className="card-body p-0">
                  <a href="single-product.html">
                    <h3 className="card-title pt-4 m-0">
                      Áo hoodie xám
                    </h3>
                  </a>
                </div>

              </div>
            </div>

            {/* Product 6 */}
            <div className="swiper-slide">
              <div className="card position-relative">

                <a href="single-product.html">
                  <img
                    src={item8}
                    className="img-fluid rounded-4"
                    alt="Áo thú cưng"
                  />
                </a>

                <div className="card-body p-0">
                  <a href="single-product.html">
                    <h3 className="card-title pt-4 m-0">
                      Áo hoodie xám
                    </h3>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Clothing;
