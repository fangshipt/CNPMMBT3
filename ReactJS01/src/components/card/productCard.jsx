import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl, formatPrice } from "../../util/api";
import { WishlistContext } from "../context/wishlistContext";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

function ProductCard({ product }) {
  if (!product) return null;
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const inWishlist = isInWishlist(product._id);
  const [adding, setAdding] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;
  const outOfStock = product.stock === 0;
  const productUrl = `/products/${product.slug || product._id}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!auth.isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    await addToCart(product._id, 1);
    setAdding(false);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!auth.isAuthenticated) { navigate('/login'); return; }
    setBuyingNow(true);
    await addToCart(product._id, 1);
    setBuyingNow(false);
    navigate('/checkout');
  };

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
        {product.isBestSeller && (
          <span className="badge" style={{ background: "#f97316", fontSize: "0.72rem" }}>🔥 Bán chạy</span>
        )}
        {product.isNewProduct && (
          <span className="badge" style={{ background: "#10b981", fontSize: "0.72rem" }}>✨ Mới</span>
        )}
        {hasDiscount && (
          <span className="badge" style={{ background: "#ef4444", fontSize: "0.72rem" }}>-{discountPercent}%</span>
        )}
        {outOfStock && (
          <span className="badge" style={{ background: "#64748b", fontSize: "0.72rem" }}>Hết hàng</span>
        )}
      </div>

      {/* Image */}
      <Link to={productUrl} className="d-block overflow-hidden">
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

        <Link to={productUrl} className="text-decoration-none flex-grow-1">
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
          <button
            className="btn btn-outline-primary rounded-2"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem", flex: "0 0 auto" }}
            disabled={outOfStock || adding}
            onClick={handleAddToCart}
            title="Thêm vào giỏ hàng"
          >
            <iconify-icon icon="ph:shopping-cart"></iconify-icon>
          </button>
          <button
            className="btn btn-primary rounded-2 flex-grow-1"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem" }}
            disabled={outOfStock || buyingNow}
            onClick={handleBuyNow}
          >
            {buyingNow ? "..." : "Mua ngay"}
          </button>
          <button
            className="btn rounded-2"
            style={{ border: inWishlist ? "1px solid #ef4444" : "1px solid #e0d5ca", color: inWishlist ? "#ef4444" : "#a0856e", background: "transparent", padding: "0.4rem 0.6rem", flex: "0 0 auto" }}
            onClick={(e) => { e.preventDefault(); if (!auth.isAuthenticated) { navigate('/login'); return; } toggleWishlist(product._id); }}
          >
            <iconify-icon icon={inWishlist ? "fluent:heart-28-filled" : "fluent:heart-28-regular"}></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
