import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProductsApi, getImageUrl, formatPrice } from "../../util/api";

function HomeProductCard({ product }) {
  const salePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPrice > 0
    ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;
  return (
    <Link to={`/products/${product.slug || product._id}`} style={{ textDecoration: "none" }}>
      <div
        style={{ borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", transition: "box-shadow 0.22s", height: "100%", display: "flex", flexDirection: "column" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,0,0,0.12)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)"}
      >
        <div style={{ position: "relative", paddingTop: "100%", overflow: "hidden", background: "#f9f3ec" }}>
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {discount > 0 && (
            <span style={{ position: "absolute", top: 10, left: 10, background: "#e74c3c", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: "0.73rem", fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
          {product.isNewProduct && (
            <span style={{ position: "absolute", top: 10, right: 10, background: "#10b981", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: "0.73rem", fontWeight: 700 }}>
              Mới
            </span>
          )}
        </div>
        <div style={{ padding: "14px 14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "0.72rem", color: "#a0856e", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {product.category?.name}
          </p>
          <h6 style={{ fontSize: "0.9rem", color: "#3a2e28", fontWeight: 500, lineHeight: 1.45, marginBottom: "auto", paddingBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </h6>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ color: "#ff6b35", fontWeight: 700, fontSize: "1rem" }}>{formatPrice(salePrice)}</span>
            {discount > 0 && <span style={{ color: "#bbb", textDecoration: "line-through", fontSize: "0.8rem" }}>{formatPrice(product.price)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewestProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductsApi({ isNewProduct: true, sortBy: "-createdAt", limit: 5 }).then((res) => {
      if (res?.EC === 0) setProducts(res.data || []);
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section style={{ background: "#fdf4ec", padding: "56px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <p style={{ color: "#c8a87a", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: 6 }}>
              Vừa lên kệ
            </p>
            <h2 style={{ color: "#3a2e28", fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.2, margin: 0 }}>
              Sản phẩm mới nhất
            </h2>
          </div>
          <Link
            to="/products?isNewProduct=true&sortBy=-createdAt"
            style={{ fontSize: "0.85rem", color: "#5a4a3f", border: "1.5px solid #5a4a3f", borderRadius: 20, padding: "6px 18px", textDecoration: "none" }}
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

export default NewestProduct;
