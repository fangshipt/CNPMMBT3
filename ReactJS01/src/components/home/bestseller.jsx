import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

function bestSeller() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi({ isBestSeller: true, limit: 4 }).then((res) => {
      if (res.EC === 0) setProducts(res.data);
    });
  }, []);

  return (
    <section id="best-selling" className="my-5 overflow-hidden">
      <div className="container py-5 mb-5">
        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
          <h2 className="display-3 fw-normal">Sản phẩm bán chạy nhất</h2>
          <div>
            <Link to="/products?isBestSeller=true" className="btn btn-outline-dark btn-lg rounded-1">
              Xem thêm
              <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </Link>
          </div>
        </div>

        <div className="row g-4">
          {products.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-3">
              <article className="card product-showcase-card position-relative h-100">
                {item.discountPrice > 0 && (
                  <div className="product-badge position-absolute">Giảm giá</div>
                )}

                <Link to={`/products/${item.slug || item._id}`}>
                  <img
                    src={getImageUrl(item.images?.[0])}
                    className="img-fluid rounded-4 product-showcase-image"
                    alt={item.name}
                  />
                </Link>

                <div className="card-body px-0 pb-0 d-flex flex-column">
                  <Link to={`/products/${item.slug || item._id}`} className="text-decoration-none">
                    <h3 className="card-title pt-4 m-0">{item.name}</h3>
                  </Link>

                  <div className="card-text flex-grow-1">
                    <span className="rating secondary-font">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <iconify-icon icon="clarity:star-solid" class="text-primary" key={star}></iconify-icon>
                      ))}
                      {" "}{item.rating}
                    </span>

                    <h3 className="secondary-font text-primary product-price">
                      {formatPrice(item.discountPrice > 0 ? item.discountPrice : item.price)}
                    </h3>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <Link to={`/products/${item.slug || item._id}`} className="btn-cart px-3 py-2" style={{ fontSize: "0.9rem", minHeight: "40px" }}>
                        <h6 className="m-0">Mua</h6>
                      </Link>
                      <a href="#" className="btn-wishlist px-3 py-2" style={{ minHeight: "40px" }}>
                        <iconify-icon icon="fluent:heart-28-filled" class="fs-6"></iconify-icon>
                      </a>
                    </div>
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

export default bestSeller;
