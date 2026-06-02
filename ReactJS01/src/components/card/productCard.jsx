import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl, formatPrice } from "../../util/api";
import { WishlistContext } from "../context/wishlistContext";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

function ProductCard({ product, showFreeship = false }) {
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
      className="card border-0 h-full relative"
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
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2, display: "flex", flexDirection: "column", gap: 4 }}>
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
        {showFreeship && (
          <span className="badge" style={{ background: "#0891b2", fontSize: "0.72rem" }}>🚚 Freeship</span>
        )}
      </div>

      {/* Image */}
      <Link to={productUrl} style={{ display: "block", overflow: "hidden" }}>
        <div style={{ position: "relative", paddingBottom: "100%", overflow: "hidden", background: "#f9f3ec" }}>
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>
      </Link>

      {/* Body */}
      <div className="card-body p-3 flex flex-col">
        {product.category?.name && (
          <Link
            to={`/products?category=${product.category._id}`}
            className="no-underline mb-1 inline-block"
            style={{ fontSize: "0.72rem", color: "#a0856e", textTransform: "uppercase", letterSpacing: "0.5px" }}
          >
            {product.category.name}
          </Link>
        )}

        <Link to={productUrl} className="no-underline">
          <h3
            style={{
              fontSize: "0.95rem",
              color: "#3a2e28",
              lineHeight: 1.4,
              height: "2.66rem",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              margin: "0 0 8px 0",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <iconify-icon
              key={s}
              icon={s <= Math.round(product.rating) ? "clarity:star-solid" : "clarity:star-line"}
              style={{ fontSize: "0.8rem", color: s <= Math.round(product.rating) ? "#f59e0b" : "#d1c4bb" }}
            ></iconify-icon>
          ))}
          <small className="text-gray-500 ml-1">{product.rating}</small>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold" style={{ fontSize: "1.05rem", color: "#ff6b35" }}>
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && (
            <small className="text-gray-500 line-through">
              {formatPrice(product.price)}
            </small>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button
            title="Thêm vào giỏ hàng"
            disabled={outOfStock || adding}
            onClick={handleAddToCart}
            onMouseEnter={e => { e.currentTarget.style.background = "#f0e8df"; e.currentTarget.style.borderColor = "#5a4a3f"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#c8b8ac"; }}
            style={{ width: 38, height: 38, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #c8b8ac", borderRadius: 10, background: "#fff", color: "#5a4a3f", cursor: outOfStock ? "not-allowed" : "pointer", fontSize: "1rem", transition: "background 0.15s, border-color 0.15s" }}
          >
            <iconify-icon icon="ph:shopping-cart"></iconify-icon>
          </button>
          <button
            disabled={outOfStock || buyingNow}
            onClick={handleBuyNow}
            style={{ flex: 1, height: 38, display: "flex", alignItems: "center", justifyContent: "center", background: outOfStock ? "#c8b8ac" : "#5a4a3f", color: "#fff", border: "none", borderRadius: 10, fontSize: "0.83rem", fontWeight: 500, cursor: outOfStock ? "not-allowed" : "pointer", transition: "opacity 0.15s" }}
            onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {buyingNow ? "..." : outOfStock ? "Hết hàng" : "Mua ngay"}
          </button>
          <button
            onClick={(e) => { e.preventDefault(); if (!auth.isAuthenticated) { navigate('/login'); return; } toggleWishlist(product._id); }}
            style={{ width: 38, height: 38, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: inWishlist ? "1.5px solid #ef4444" : "1.5px solid #e0d5ca", borderRadius: 10, background: inWishlist ? "#fff5f5" : "transparent", color: inWishlist ? "#ef4444" : "#a0856e", cursor: "pointer", fontSize: "1rem", transition: "all 0.15s" }}
          >
            <iconify-icon icon={inWishlist ? "fluent:heart-28-filled" : "fluent:heart-28-regular"}></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
