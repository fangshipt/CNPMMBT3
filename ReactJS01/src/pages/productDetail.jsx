import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductByIdOrSlugApi, formatPrice } from "../util/api";
import ProductSwiper from "../components/product/productSwiper";
import RelatedProducts from "../components/product/relatedProducts";
import QuantityButton from "../components/common/quantityButton";
import Loading from "../components/common/loading";

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const apiCallRef = useRef(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setAddedToCart(false);
    
    // Chỉ gọi API 1 lần, ngay cả khi React StrictMode chạy effect 2 lần
    if (!apiCallRef.current) {
      apiCallRef.current = true;
      getProductByIdOrSlugApi(id).then((res) => {
        if (res.EC === 0) setProduct(res.data);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
    }
    
    return () => {
      // Reset flag khi component unmount hoặc id thay đổi
      apiCallRef.current = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: "#F9F3EC", minHeight: "100vh" }} className="py-5">
        <div className="container"><Loading /></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ background: "#F9F3EC", minHeight: "100vh" }} className="py-5">
        <div className="container text-center">
          <iconify-icon icon="ph:warning-circle" style={{ fontSize: "3rem", color: "#ccc" }}></iconify-icon>
          <p className="mt-3 text-muted">Không tìm thấy sản phẩm.</p>
          <Link to="/products" className="btn btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0;
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const PET_LABELS = { dog: "Chó", cat: "Mèo", bird: "Chim", fish: "Cá" };

  return (
    <div style={{ background: "#F9F3EC", minHeight: "100vh" }}>
      {/* Breadcrumb strip */}
      <div className="container pt-4 pb-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/products">Sản phẩm</Link></li>
            {product.category && (
              <li className="breadcrumb-item">
                <Link to={`/products?category=${product.category._id}`}>{product.category.name}</Link>
              </li>
            )}
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: "200px" }}>
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container pb-5">
        {/* Main product card */}
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
          <div className="row g-5">
            {/* Image gallery */}
            <div className="col-md-5">
              <ProductSwiper images={product.images || []} />
            </div>

            {/* Info */}
            <div className="col-md-7">
              {/* Category + badges */}
              <div className="mb-2 d-flex flex-wrap gap-2 align-items-center">
                {product.category && (
                  <Link
                    to={`/products?category=${product.category._id}`}
                    className="badge text-decoration-none"
                    style={{ background: "#f0e8df", color: "#a0856e", fontSize: "0.82rem", fontWeight: 500 }}
                  >
                    <iconify-icon icon="ph:tag" class="me-1"></iconify-icon>
                    {product.category.name}
                  </Link>
                )}
                {product.isBestSeller && (
                  <span className="badge" style={{ background: "#ff6b35", fontSize: "0.8rem" }}>🔥 Bán chạy</span>
                )}
                {product.isNewProduct && (
                  <span className="badge bg-success" style={{ fontSize: "0.8rem" }}>✨ Hàng mới</span>
                )}
              </div>

              {/* Name */}
              <h1 className="h2 mb-3" style={{ fontWeight: 400, color: "#3a2e28" }}>{product.name}</h1>

              {/* Rating + sold */}
              <div className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #f0e8df" }}>
                <div className="d-flex align-items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <iconify-icon
                      key={s}
                      icon={s <= Math.round(product.rating) ? "clarity:star-solid" : "clarity:star-line"}
                      class="text-primary"
                      style={{ fontSize: "1rem" }}
                    ></iconify-icon>
                  ))}
                  <span className="text-muted ms-1 small">({product.rating}/5)</span>
                </div>
                <span className="text-muted small">
                  <iconify-icon icon="ph:shopping-bag" class="me-1"></iconify-icon>
                  Đã bán: <strong>{product.sold}</strong>
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 p-3 rounded-3" style={{ background: "#FFF8F0" }}>
                <div className="d-flex align-items-center gap-3">
                  <span className="secondary-font text-primary" style={{ fontSize: "2rem", fontWeight: 600 }}>
                    {formatPrice(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-muted text-decoration-line-through fs-5">
                        {formatPrice(product.price)}
                      </span>
                      <span className="badge" style={{ background: "#e74c3c", fontSize: "0.9rem" }}>
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <small className="text-success">
                    Tiết kiệm {formatPrice(product.price - product.discountPrice)}
                  </small>
                )}
              </div>

              {/* Stock + pet type */}
              <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
                {inStock ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success">Còn hàng</span>
                    <span className="text-muted small">({product.stock} có sẵn)</span>
                  </div>
                ) : (
                  <span className="badge bg-danger fs-6">Hết hàng</span>
                )}
                {product.petType && product.petType !== "all" && (
                  <span className="badge" style={{ background: "#f0e8df", color: "#a0856e" }}>
                    Phù hợp: {PET_LABELS[product.petType] || product.petType}
                  </span>
                )}
              </div>

              {/* Quantity + cart */}
              {inStock && (
                <div className="mb-4">
                  <p className="text-muted small mb-2">Số lượng:</p>
                  <div className="d-flex gap-3 align-items-center flex-wrap">
                    <QuantityButton quantity={quantity} onChange={setQuantity} min={1} max={product.stock} />
                    <button
                      className={`btn btn-lg rounded-2 px-4 ${addedToCart ? "btn-success" : "btn-primary"}`}
                      onClick={handleAddToCart}
                      style={{ transition: "background 0.3s" }}
                    >
                      <iconify-icon icon={addedToCart ? "ph:check" : "ph:shopping-cart"} class="me-2"></iconify-icon>
                      {addedToCart ? "Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}
                    </button>
                    <button className="btn btn-lg rounded-2 px-3" style={{ border: "1px solid #e0d5ca", color: "#a0856e" }}>
                      <iconify-icon icon="fluent:heart-28-regular" class="fs-5"></iconify-icon>
                    </button>
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="pt-4" style={{ borderTop: "1px solid #f0e8df" }}>
                  <h6 className="fw-bold mb-2" style={{ color: "#5a4a3f" }}>Mô tả sản phẩm</h6>
                  <p className="text-muted" style={{ lineHeight: 1.8 }}>{product.description}</p>
                </div>
              )}

              {/* Meta */}
              <div className="pt-3 mt-2" style={{ borderTop: "1px solid #f0e8df" }}>
                <div className="row g-2 text-muted small">
                  <div className="col-6">
                    <iconify-icon icon="ph:package" class="me-1"></iconify-icon>
                    Tồn kho: <strong className={inStock ? "text-success" : "text-danger"}>{product.stock}</strong>
                  </div>
                  <div className="col-6">
                    <iconify-icon icon="ph:chart-line-up" class="me-1"></iconify-icon>
                    Đã bán: <strong>{product.sold}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-normal m-0" style={{ color: "#3a2e28" }}>Đánh giá từ khách hàng</h3>
            <Link to="#review-form" className="btn btn-sm rounded-2" style={{ border: "1px solid #c8b8ac", color: "#5a4a3f" }}>
              Viết đánh giá
            </Link>
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="row g-3">
              {product.reviews.map((r, idx) => (
                <div key={idx} className="col-12">
                  <article className="p-3 rounded-3" style={{ background: "#FFF8F0" }}>
                    <div className="d-flex align-items-start gap-3">
                      <img
                        src={r.avatar || "/assets/default-avatar.png"}
                        alt={r.name}
                        className="rounded-circle"
                        style={{ width: 48, height: 48, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong style={{ color: "#3a2e28" }}>{r.name}</strong>
                          <span className="text-muted small">• {r.date || ""}</span>
                        </div>
                        <div className="mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <iconify-icon key={s} icon={s <= Math.round(r.rating || 0) ? "clarity:star-solid" : "clarity:star-line"} class="text-primary" style={{ fontSize: "0.9rem" }}></iconify-icon>
                          ))}
                        </div>
                        <p className="mb-0 text-muted">{r.comment}</p>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4" style={{ color: "#aaa" }}>
              <iconify-icon icon="ph:chat-circle" style={{ fontSize: "2.5rem" }}></iconify-icon>
              <p className="mt-2 mb-3">Chưa có đánh giá nào cho sản phẩm này.</p>
              <Link to="#review-form" className="btn btn-primary rounded-2">Viết đánh giá</Link>
            </div>
          )}
        </div>

        {/* Related products */}
        <RelatedProducts productId={product._id} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
