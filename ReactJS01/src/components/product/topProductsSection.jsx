import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTopSellersApi, getMostViewedApi, getImageUrl, formatPrice } from "../../util/api";

const TABS = [
  { key: "best-sellers", label: "🔥 Bán chạy nhất", fetchFn: () => getTopSellersApi(10) },
  { key: "most-viewed",  label: "👁️ Xem nhiều nhất", fetchFn: () => getMostViewedApi(10) },
];

const PER_PAGE = 5; // sản phẩm mỗi trang ngang

function MiniProductCard({ product }) {
  if (!product) return null;
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
        flex: "0 0 auto",
        width: "100%",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
      }}
    >
      {/* Badge */}
      {hasDiscount && (
        <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
          <span className="badge" style={{ background: "#e74c3c", fontSize: "0.68rem" }}>-{discountPercent}%</span>
        </div>
      )}
      {product.isNewProduct && (
        <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
          <span className="badge" style={{ background: "#10b981", fontSize: "0.68rem" }}>Mới</span>
        </div>
      )}

      {/* Image */}
      <Link to={`/products/${product.slug || product._id}`} className="d-block overflow-hidden" style={{ aspectRatio: "1" }}>
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23f5f5f5'/%3E%3C/svg%3E"; }}
        />
      </Link>

      {/* Info */}
      <div className="p-2">
        {product.category?.name && (
          <div style={{ fontSize: "0.68rem", color: "#a0856e", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>
            {product.category.name}
          </div>
        )}
        <Link to={`/products/${product.slug || product._id}`} className="text-decoration-none">
          <div
            style={{
              fontSize: "0.82rem", color: "#3a2e28", fontWeight: 500, lineHeight: 1.35,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              marginBottom: 6,
            }}
          >
            {product.name}
          </div>
        </Link>

        <div className="d-flex align-items-baseline gap-1">
          <span style={{ fontSize: "0.9rem", color: "#ff6b35", fontWeight: 700 }}>{formatPrice(displayPrice)}</span>
          {hasDiscount && (
            <span style={{ fontSize: "0.72rem", color: "#aaa", textDecoration: "line-through" }}>{formatPrice(product.price)}</span>
          )}
        </div>

        {/* Stats */}
        <div style={{ fontSize: "0.7rem", color: "#bbb", marginTop: 4, display: "flex", gap: 8 }}>
          {product.sold > 0 && <span>🛒 {product.sold} đã bán</span>}
          {product.views > 0 && <span>👁 {product.views}</span>}
        </div>
      </div>
    </div>
  );
}

function TopProductsSection() {
  const [activeTab, setActiveTab] = useState("best-sellers");
  const [data, setData] = useState({ "best-sellers": [], "most-viewed": [] });
  const [loadedTabs, setLoadedTabs] = useState({ "best-sellers": false, "most-viewed": false });
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0); // current horizontal page

  // Fetch data for active tab (lazy per tab)
  useEffect(() => {
    if (loadedTabs[activeTab]) return;
    const tab = TABS.find((t) => t.key === activeTab);
    if (!tab) return;

    setLoading(true);
    tab.fetchFn().then((res) => {
      if (res.EC === 0) {
        setData((prev) => ({ ...prev, [activeTab]: res.data }));
        setLoadedTabs((prev) => ({ ...prev, [activeTab]: true }));
      }
      setLoading(false);
    });
  }, [activeTab, loadedTabs]);

  // Reset slide when tab changes
  useEffect(() => {
    setSlide(0);
  }, [activeTab]);

  const items = data[activeTab] || [];
  const totalPages = Math.ceil(items.length / PER_PAGE);
  const visibleItems = items.slice(slide * PER_PAGE, (slide + 1) * PER_PAGE);

  if (!loading && items.length === 0 && loadedTabs[activeTab]) return null;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 28,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header: tabs + navigation */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8 }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "7px 18px",
                borderRadius: 24,
                border: "none",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab.key ? "#ff6b35" : "#f5ede7",
                color: activeTab === tab.key ? "#fff" : "#5a4a3f",
                boxShadow: activeTab === tab.key ? "0 2px 8px rgba(255,107,53,0.35)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Horizontal pagination controls */}
        {!loading && totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setSlide((s) => Math.max(0, s - 1))}
              disabled={slide === 0}
              style={{
                width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #e0d5ca",
                background: slide === 0 ? "#f9f3ec" : "#fff",
                color: slide === 0 ? "#ccc" : "#5a4a3f",
                cursor: slide === 0 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", transition: "all 0.2s",
              }}
              aria-label="Trang trước"
            >
              ‹
            </button>

            {/* Page dots */}
            <div style={{ display: "flex", gap: 5 }}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  style={{
                    width: i === slide ? 20 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: "none",
                    background: i === slide ? "#ff6b35" : "#e0d5ca",
                    cursor: "pointer",
                    transition: "all 0.25s",
                    padding: 0,
                  }}
                  aria-label={`Trang ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setSlide((s) => Math.min(totalPages - 1, s + 1))}
              disabled={slide === totalPages - 1}
              style={{
                width: 34, height: 34, borderRadius: "50%", border: "1.5px solid #e0d5ca",
                background: slide === totalPages - 1 ? "#f9f3ec" : "#fff",
                color: slide === totalPages - 1 ? "#ccc" : "#5a4a3f",
                cursor: slide === totalPages - 1 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", transition: "all 0.2s",
              }}
              aria-label="Trang sau"
            >
              ›
            </button>

            <span style={{ fontSize: "0.78rem", color: "#aaa", marginLeft: 4 }}>
              {slide * PER_PAGE + 1}–{Math.min((slide + 1) * PER_PAGE, items.length)} / {items.length}
            </span>
          </div>
        )}
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border spinner-border-sm text-primary" role="status" />
          <span className="ms-2 text-muted small">Đang tải...</span>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${PER_PAGE}, 1fr)`,
            gap: 14,
          }}
        >
          {visibleItems.map((product) => (
            <MiniProductCard key={product._id} product={product} />
          ))}

          {/* Placeholder cards to keep grid layout when fewer than PER_PAGE items */}
          {visibleItems.length < PER_PAGE &&
            Array.from({ length: PER_PAGE - visibleItems.length }).map((_, i) => (
              <div key={`ph-${i}`} style={{ visibility: "hidden" }} />
            ))}
        </div>
      )}
    </div>
  );
}

export default TopProductsSection;
