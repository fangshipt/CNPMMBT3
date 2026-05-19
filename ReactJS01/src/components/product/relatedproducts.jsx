import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRelatedProductsApi } from "../../util/api";
import ProductCard from "../card/productCard";
import Loading from "../common/loading";

function RelatedProducts({ productId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getRelatedProductsApi(productId, 4).then((res) => {
      if (res.EC === 0) setProducts(res.data);
      setLoading(false);
    });
  }, [productId]);

  if (loading) return <Loading text="Đang tải sản phẩm tương tự..." />;
  if (!products.length) return null;

  return (
    <section className="mt-5 pt-4 border-top">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-normal m-0">Sản phẩm tương tự</h3>
        <Link to="/products" className="btn btn-outline-dark btn-sm rounded-1">
          Xem thêm
          <svg width="18" height="18" viewBox="0 0 24 24" className="mb-1 ms-1">
            <use xlinkHref="#arrow-right"></use>
          </svg>
        </Link>
      </div>

      <div className="row g-3">
        {products.map((product) => (
          <div key={product._id} className="col-sm-6 col-lg-3">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
