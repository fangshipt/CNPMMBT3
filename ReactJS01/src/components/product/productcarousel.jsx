import { useState, useEffect } from "react";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

function Clothing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi({ isFeatured: true, limit: 6 }).then((res) => {
      if (res.EC === 0) setProducts(res.data);
    });
  }, []);

  return (
    <section id="clothing" className="my-5 overflow-hidden">
      <div className="container pb-5">

        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
          <h2 className="display-3 fw-normal">Trang phục thú cưng</h2>

          <div>
            <a
              href="#"
              className="btn btn-outline-dark btn-lg text-uppercase fs-6 rounded-1"
            >
              Xem thêm
              <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </a>
          </div>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 col-lg-2">
              <div className="card position-relative">
                {product.isNewProduct && (
                  <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                    Mới
                  </div>
                )}
                {product.discountPrice > 0 && !product.isNewProduct && (
                  <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                    -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                  </div>
                )}

                <a href="#">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    className="img-fluid rounded-4"
                    alt={product.name}
                  />
                </a>

                <div className="card-body p-0">
                  <a href="#">
                    <h3 className="card-title pt-4 m-0">{product.name}</h3>
                  </a>

                  <div className="card-text">
                    <span className="rating secondary-font">
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      <iconify-icon icon="clarity:star-solid" class="text-primary"></iconify-icon>
                      {" "}{product.rating}
                    </span>

                    <h3 className="secondary-font text-primary">
                      {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
                    </h3>

                    <div className="d-flex flex-wrap mt-3">
                      <a href="#" className="btn-cart me-3 px-4 pt-3 pb-3">
                        <h5 className="text-uppercase m-0">Thêm vào giỏ</h5>
                      </a>
                      <a href="#" className="btn-wishlist px-4 pt-3">
                        <iconify-icon icon="fluent:heart-28-filled" class="fs-5"></iconify-icon>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Clothing;
