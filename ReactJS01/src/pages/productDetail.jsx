import { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { message, Rate } from "antd";
import { getProductByIdOrSlugApi, formatPrice, canReviewApi, addReviewApi } from "../util/api";
import ProductSwiper from "../components/product/productSwiper";
import RelatedProducts from "../components/product/relatedProducts";
import QuantityButton from "../components/common/quantityButton";
import Loading from "../components/common/loading";
import { CartContext } from "../components/context/cartContext";
import { AuthContext } from "../components/context/authContext";
import { WishlistContext } from "../components/context/wishlistContext";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const apiCallRef = useRef(null);

  useEffect(() => {
    // Lưu id vào ref: nếu cùng id (kể cả StrictMode re-run), bỏ qua
    if (apiCallRef.current === id) return;
    apiCallRef.current = id;

    setLoading(true);
    setQuantity(1);
    setAddedToCart(false);

    getProductByIdOrSlugApi(id).then((res) => {
      if (res.EC === 0) setProduct(res.data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching product:", error);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (auth.isAuthenticated && product) {
      canReviewApi(product._id).then((res) => {
        if (res?.EC === 0) setCanReview(res.data.canReview);
      }).catch(() => {});
    }
  }, [auth.isAuthenticated, product]);

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

  const handleAddToCart = async () => {
    if (!auth.isAuthenticated) { navigate('/login'); return; }
    setAddingToCart(true);
    const res = await addToCart(product._id, quantity);
    setAddingToCart(false);
    if (res?.EC === 0) {
      setAddedToCart(true);
      message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
      setTimeout(() => setAddedToCart(false), 2500);
    } else {
      message.error(res?.EM || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleBuyNow = async () => {
    if (!auth.isAuthenticated) { navigate('/login'); return; }
    const res = await addToCart(product._id, quantity);
    if (res?.EC === 0) navigate('/checkout');
    else message.error(res?.EM || 'Không thể thêm vào giỏ hàng');
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
                  <span className="badge" style={{ background: "#f97316", fontSize: "0.8rem" }}>🔥 Bán chạy</span>
                )}
                {product.isNewProduct && (
                  <span className="badge" style={{ background: "#10b981", fontSize: "0.8rem" }}>✨ Hàng mới</span>
                )}
                {product.discountPrice > 0 && product.discountPrice < product.price && (
                  <span className="badge" style={{ background: "#ef4444", fontSize: "0.8rem" }}>
                    -{Math.round((1 - product.discountPrice / product.price) * 100)}% SALE
                  </span>
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
              <div className="mb-4">
                {inStock && (
                  <div className="mb-3">
                    <p className="text-muted small mb-2">Số lượng:</p>
                    <QuantityButton quantity={quantity} onChange={setQuantity} min={1} max={product.stock} />
                  </div>
                )}
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <button
                    className={`btn btn-lg rounded-2 px-4 ${addedToCart ? "btn-success" : "btn-outline-primary"}`}
                    onClick={handleAddToCart}
                    disabled={!inStock || addingToCart}
                    style={{ transition: "background 0.3s" }}
                  >
                    <iconify-icon icon={addedToCart ? "ph:check" : "ph:shopping-cart"} class="me-2"></iconify-icon>
                    {addingToCart ? "Đang thêm..." : addedToCart ? "Đã thêm!" : "Thêm vào giỏ"}
                  </button>
                  <button
                    className="btn btn-primary btn-lg rounded-2 px-4"
                    onClick={handleBuyNow}
                    disabled={!inStock}
                  >
                    <iconify-icon icon="ph:lightning" class="me-2"></iconify-icon>
                    Mua ngay
                  </button>
                  <button
                    className="btn btn-lg rounded-2 px-3"
                    style={{ border: isInWishlist(product._id) ? "1px solid #ef4444" : "1px solid #e0d5ca", color: isInWishlist(product._id) ? "#ef4444" : "#a0856e" }}
                    onClick={() => { if (!auth.isAuthenticated) { navigate('/login'); return; } toggleWishlist(product._id); }}
                  >
                    <iconify-icon icon={isInWishlist(product._id) ? "fluent:heart-28-filled" : "fluent:heart-28-regular"} class="fs-5"></iconify-icon>
                  </button>
                </div>
              </div>

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
        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mb-4" id="reviews">
          <h3 className="fw-normal mb-4" style={{ color: "#3a2e28" }}>
            Đánh giá từ khách hàng
            <span className="ms-2 text-muted" style={{ fontSize: "1rem" }}>({product.reviews?.length || 0})</span>
          </h3>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="row g-3 mb-4">
              {product.reviews.map((r, idx) => (
                <div key={idx} className="col-12">
                  <article className="p-3 rounded-3" style={{ background: "#FFF8F0" }}>
                    <div className="d-flex align-items-start gap-3">
                      <img
                        src={r.user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                        alt={r.user?.fullName}
                        className="rounded-circle"
                        style={{ width: 44, height: 44, objectFit: "cover", flexShrink: 0 }}
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong style={{ color: "#3a2e28" }}>{r.user?.fullName || "Khách hàng"}</strong>
                          <span className="text-muted small">• {new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <Rate disabled defaultValue={r.rating} style={{ fontSize: "0.85rem", color: "#f59e0b" }} />
                        {r.comment && <p className="mb-0 mt-1 text-muted small">{r.comment}</p>}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 mb-4" style={{ color: "#aaa" }}>
              <iconify-icon icon="ph:chat-circle" style={{ fontSize: "2.5rem" }}></iconify-icon>
              <p className="mt-2 mb-0">Chưa có đánh giá nào cho sản phẩm này.</p>
            </div>
          )}

          {/* Review form */}
          <div id="review-form" style={{ borderTop: "1px solid #f0e8df", paddingTop: "1.5rem" }}>
            {!auth.isAuthenticated ? (
              <p className="text-muted text-center">
                <Link to="/login">Đăng nhập</Link> để viết đánh giá
              </p>
            ) : canReview ? (
              <div>
                <h6 className="fw-bold mb-3" style={{ color: "#5a4a3f" }}>Viết đánh giá của bạn</h6>
                <div className="mb-3">
                  <label className="text-muted small mb-1 d-block">Đánh giá sao</label>
                  <Rate value={reviewRating} onChange={setReviewRating} style={{ color: "#f59e0b" }} />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ borderColor: "#e0d5ca", borderRadius: "10px", resize: "none" }}
                  />
                </div>
                <button
                  className="btn btn-primary rounded-2 px-4"
                  disabled={submittingReview}
                  onClick={async () => {
                    if (!reviewRating) { message.warning("Vui lòng chọn số sao"); return; }
                    setSubmittingReview(true);
                    const res = await addReviewApi(product._id, { rating: reviewRating, comment: reviewComment });
                    setSubmittingReview(false);
                    if (res?.EC === 0) {
                      message.success("Cảm ơn bạn đã đánh giá!");
                      setProduct(prev => ({ ...prev, reviews: res.data }));
                      setCanReview(false);
                    } else {
                      message.error(res?.EM || "Không thể gửi đánh giá");
                    }
                  }}
                >
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
              </div>
            ) : (
              <p className="text-muted text-center small">
                <iconify-icon icon="ph:lock-simple" class="me-1"></iconify-icon>
                Bạn chỉ có thể đánh giá sau khi mua hàng. 
              </p>
            )}
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts productId={product._id} />
      </div>
    </div>
  );
}

export default ProductDetailPage;
