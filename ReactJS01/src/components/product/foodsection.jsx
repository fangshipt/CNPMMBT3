import { useState, useEffect } from "react";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

const FILTERS = [
  { label: "Tất cả", value: "" },
  { label: "Mèo", value: "cat" },
  { label: "Chó", value: "dog" },
  { label: "Chim", value: "bird" },
];

function Foodies() {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");

  useEffect(() => {
    const params = { limit: 8 };
    if (activeFilter) params.petType = activeFilter;
    getProductsApi(params).then((res) => {
      if (res.EC === 0) setProducts(res.data);
    });
  }, [activeFilter]);

  return (
    <section id="foodies" className="my-5">
      <div className="container my-5 py-5">

        <div className="section-header d-md-flex justify-content-between align-items-center">
          <h2 className="display-3 fw-normal">Thức ăn thú cưng</h2>

          <div className="mb-4 mb-md-0">
            <p className="m-0">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`filter-button me-4 ${activeFilter === f.value ? "active" : ""}`}
                  onClick={() => setActiveFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </p>
          </div>

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

        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 col-lg-3 my-4">
              <div className="card position-relative">
                {product.isNewProduct && (
                  <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                    New
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="z-1 position-absolute rounded-3 m-3 px-3 border border-dark-subtle">
                    Hết hàng
                  </div>
                )}
                {product.discountPrice > 0 && product.stock > 0 && !product.isNewProduct && (
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

export default Foodies;
