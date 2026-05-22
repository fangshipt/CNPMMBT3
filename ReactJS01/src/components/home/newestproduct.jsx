import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

function newestProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi({ isNewProduct: true, limit: 4 }).then((res) => {
      if (res.EC === 0) setProducts(res.data);
    });
  }, []);

  return (
    <section id="newest-products" className="my-5 py-5">
      <div className="container">
        <div className="section-header text-center mb-5">
          <p className="secondary-font text-primary mb-2">Vừa lên kệ</p>
          <h2 className="section-title mb-0">Sản phẩm mới cho bé</h2>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div key={product._id} className="col-md-6 col-lg-3">
              <article className="card product-showcase-card h-100 text-center">
                <Link to={`/products/${product.slug || product._id}`}>
                  <img
                    src={getImageUrl(product.images?.[0])}
                    className="img-fluid rounded-4 product-showcase-image"
                    alt={product.name}
                  />
                </Link>

                <div className="card-body px-0 pb-0 d-flex flex-column">
                  <div className="product-label mb-3">
                    {product.category?.name && (
                      <Link to={`/products?category=${product.category._id}`} className="text-decoration-none" style={{ color: "inherit" }}>
                        {product.category.name}
                      </Link>
                    )}
                  </div>
                  <Link to={`/products/${product.slug || product._id}`} className="text-decoration-none">
                    <h5
                      className="card-title"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "calc(1.4em * 2)",
                        lineHeight: 1.4,
                      }}
                    >
                      {product.name}
                    </h5>
                  </Link>
                  <p className="card-text text-primary fw-bold product-price">
                    {formatPrice(product.discountPrice > 0 ? product.discountPrice : product.price)}
                  </p>
                  <Link to={`/products/${product.slug || product._id}`} className="btn btn-outline-primary btn-sm mt-auto">
                    Thêm vào giỏ
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default newestProduct;
