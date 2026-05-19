import { useState, useEffect } from "react";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

function BestSelling() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi({ isBestSeller: true, limit: 6 }).then((res) => {
      if (res.EC === 0) setProducts(res.data);
    });
  }, []);

  return (
    <section id="bestselling" className="my-5 overflow-hidden">
      <div className="container py-5 mb-5">

        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
          <h2 className="display-3 fw-normal">Sản phẩm bán chạy</h2>

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
                {product.discountPrice > 0 && (
                  <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                    Giảm giá
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

export default BestSelling;
