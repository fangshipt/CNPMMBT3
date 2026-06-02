import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

function HomeProductCard({ product }) {
  const salePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  return (
    <Link
      to={`/products/${product.slug || product._id}`}
      className="no-underline d-block h-100"
    >
      <div
        className="rounded-[16px] overflow-hidden bg-white h-100 d-flex flex-column"
        style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.11)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"}
      >
        {/* Image 1:1 */}
        <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", background: "#f9f3ec", flexShrink: 0 }}>
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {discount > 0 && (
            <span style={{ position: "absolute", top: 10, left: 10, color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700, background: "#e74c3c" }}>
              -{discount}%
            </span>
          )}
          {product.sold > 0 && (
            <span style={{ position: "absolute", bottom: 10, left: 10, color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: "0.7rem", background: "rgba(58,46,40,0.75)" }}>
              Đã bán {product.sold}
            </span>
          )}
        </div>
        {/* Body */}
        <div className="d-flex flex-column flex-grow-1" style={{ padding: "12px 14px 14px" }}>
          <p className="mb-1 text-truncate" style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.5px", color: "#a0856e" }}>
            {product.category?.name}
          </p>
          <h6
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              lineHeight: 1.45,
              color: "#3a2e28",
              height: "2.61rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              margin: 0,
            }}
          >
            {product.name}
          </h6>
          <div className="d-flex align-items-baseline gap-2 mt-2">
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#ff6b35" }}>
              {formatPrice(salePrice)}
            </span>
            {discount > 0 && (
              <span style={{ textDecoration: "line-through", fontSize: "0.78rem", color: "#b8a89a" }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function BestSeller() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi({ sortBy: "-sold", limit: 5 }).then((res) => {
      if (res?.EC === 0) setProducts((res.data || []).filter(p => p.sold > 0));
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section style={{ background: "#f9f3ec", padding: "36px 0 52px" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, color: "#c8a87a", marginBottom: 4 }}>
              Được yêu thích nhất
            </p>
            <h2 style={{ fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.2, margin: 0, color: "#3a2e28" }}>
              Sản phẩm bán chạy
            </h2>
          </div>
          <Link
            to="/products?sortBy=-sold"
            className="no-underline"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.84rem", fontWeight: 500, color: "#5a4a3f", border: "1.5px solid #5a4a3f", borderRadius: 999, padding: "8px 22px", background: "transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#5a4a3f"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a4a3f"; }}
          >
            Xem thêm →
          </Link>
        </div>

        <div className="row g-3 row-cols-2 row-cols-md-3 row-cols-lg-5">
          {products.map((p) => (
            <div key={p._id} className="col">
              <HomeProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
