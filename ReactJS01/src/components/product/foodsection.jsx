import item9 from "../../assets/item9.jpg";
import item10 from "../../assets/item10.jpg";
import item11 from "../../assets/item11.jpg";
import item12 from "../../assets/item12.jpg";
import item13 from "../../assets/item13.jpg";
import item14 from "../../assets/item14.jpg";
import item15 from "../../assets/item15.jpg";
import item16 from "../../assets/item16.jpg";

function Foodies() {
  return (
    <section id="foodies" className="my-5">
      <div className="container my-5 py-5">

        {/* Header */}
        <div className="section-header d-md-flex justify-content-between align-items-center">

          <h2 className="display-3 fw-normal">
            Thức ăn thú cưng
          </h2>

          <div className="mb-4 mb-md-0">
            <p className="m-0">
              <button className="filter-button me-4 active">
                Tất cả
              </button>

              <button className="filter-button me-4">
                Mèo
              </button>

              <button className="filter-button me-4">
                Chó
              </button>

              <button className="filter-button me-4">
                Chim
              </button>
            </p>
          </div>

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

        {/* Products */}
        <div className="row">

          {/* Item 1 */}
          <div className="col-md-4 col-lg-3 my-4">
            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item9}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">

                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Hạt vị cá hồi
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
                    189.000đ
                  </h3>

                </div>

              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="col-md-4 col-lg-3 my-4">

            <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
              New
            </div>

            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item10}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">

                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Pate cho mèo
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
                    45.000đ
                  </h3>

                </div>

              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="col-md-4 col-lg-3 my-4">
            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item11}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">

                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Snack thưởng nhỏ
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
                    69.000đ
                  </h3>

                </div>

              </div>
            </div>
          </div>

          {/* Item 4 */}
          <div className="col-md-4 col-lg-3 my-4">

            <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
              Hết hàng
            </div>

            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item12}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">

                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Sữa tắm dịu nhẹ
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
                    99.000đ
                  </h3>

                </div>

              </div>
            </div>
          </div>

          {/* Item 5 */}
          <div className="col-md-4 col-lg-3 my-4">
            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item13}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">
                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Hạt cho chó nhỏ
                  </h3>
                </a>
              </div>

            </div>
          </div>

          {/* Item 6 */}
          <div className="col-md-4 col-lg-3 my-4">
            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item14}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">
                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Xương gặm sạch răng
                  </h3>
                </a>
              </div>

            </div>
          </div>

          {/* Item 7 */}
          <div className="col-md-4 col-lg-3 my-4">

            <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
              Giảm giá
            </div>

            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item15}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">
                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Cát vệ sinh mèo
                  </h3>
                </a>
              </div>

            </div>
          </div>

          {/* Item 8 */}
          <div className="col-md-4 col-lg-3 my-4">
            <div className="card position-relative">

              <a href="single-product.html">
                <img
                  src={item16}
                  className="img-fluid rounded-4"
                  alt="Sản phẩm thú cưng"
                />
              </a>

              <div className="card-body p-0">
                <a href="single-product.html">
                  <h3 className="card-title pt-4 m-0">
                    Sốt trộn bữa ăn
                  </h3>
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Foodies;
