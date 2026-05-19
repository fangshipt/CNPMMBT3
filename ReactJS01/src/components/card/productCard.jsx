import { Link } from "react-router-dom";
import { getImageUrl, formatPrice } from "../../util/api";

function ProductCard({ product }) {
  if (!product) return null;

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;

  return (
    <div
      className="card border-0 h-100 position-relative"
      style={{
        borderRadius: "16px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transition: "transform 0.22s, box-shadow 0.22s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.11)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
      }}
    >
      {/* Badges */}
      <div
        className="position-absolute"
        style={{ top: 10, left: 10, zIndex: 2, display: "flex", flexDirection: "column", gap: 4 }}
      >
        {product.isNewProduct && <span className="badge bg-success">Mới</span>}
        {hasDiscount && !product.isNewProduct && (
          <span className="badge" style={{ background: "#e74c3c" }}>-{discountPercent}%</span>
        )}
        {product.stock === 0 && <span className="badge bg-secondary">Hết hàng</span>}
      </div>

      {/* Image */}
      <Link to={`/products/${product._id}`} className="d-block overflow-hidden">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          style={{
            width: "100%",
            aspectRatio: "1",
            objectFit: "cover",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </Link>

      {/* Body */}
      <div className="card-body p-3 d-flex flex-column">
        {product.category?.name && (
          <Link
            to={`/products?category=${product.category._id}`}
            className="text-decoration-none mb-1 d-inline-block"
            style={{ fontSize: "0.72rem", color: "#a0856e", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            {product.category.name}
          </Link>
        )}

        <Link to={`/products/${product._id}`} className="text-decoration-none flex-grow-1">
          <h3
            className="card-title mb-2"
            style={{
              fontSize: "0.95rem",
              color: "#3a2e28",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="d-flex align-items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <iconify-icon
              key={s}
              icon={s <= Math.round(product.rating) ? "clarity:star-solid" : "clarity:star-line"}
              class="text-primary"
              style={{ fontSize: "0.8rem" }}
            ></iconify-icon>
          ))}
          <small className="text-muted ms-1">{product.rating}</small>
        </div>

        <div className="d-flex align-items-baseline gap-2 mb-3">
          <span className="secondary-font text-primary fw-bold" style={{ fontSize: "1.05rem" }}>
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <small className="text-muted text-decoration-line-through">
              {formatPrice(product.price)}
            </small>
          )}
        </div>

        <div className="d-flex gap-2 mt-auto">
          <Link
            to={`/products/${product._id}`}
            className="btn btn-primary btn-sm rounded-2 flex-grow-1"
            style={{ fontSize: "0.8rem" }}
          >
            <iconify-icon icon="ph:shopping-cart" class="me-1"></iconify-icon>
            Thêm vào giỏ
          </Link>
          <button
            className="btn btn-sm rounded-2 px-2"
            style={{ border: "1px solid #e0d5ca", color: "#a0856e", background: "transparent" }}
          >
            <iconify-icon icon="fluent:heart-28-regular"></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
