import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProductsApi, getCategoriesApi, getActiveFreeshipApi } from "../util/api";
import ProductCard from "../components/card/productCard";
import Loading from "../components/common/loading";
import TopProductsSection from "../components/product/topProductsSection";

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "-createdAt" },
  { label: "Bán chạy", value: "-sold" },
  { label: "Xem nhiều", value: "-views" },
  { label: "Giá thấp → cao", value: "price" },
  { label: "Giá cao → thấp", value: "-price" },
];

function FilterCard({ title, children }) {
  return (
    <div className="mb-3" style={{ background: "#fff", borderRadius: "14px", boxShadow: "0 1px 8px rgba(0,0,0,0.07)", padding: "16px 18px" }}>
      <h6 className="font-bold mb-3 pb-2" style={{ borderBottom: "1px solid #f0e8df", color: "#5a4a3f", fontSize: "0.95rem" }}>
        {title}
      </h6>
      {children}
    </div>
  );
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states — each setter resets page to 1 directly
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "-createdAt");
  const [isBestSeller, setIsBestSeller] = useState(searchParams.get("isBestSeller") === "true");
  const [isNewProduct, setIsNewProduct] = useState(searchParams.get("isNewProduct") === "true");
  const [isOnSale, setIsOnSale] = useState(searchParams.get("isOnSale") === "true");

  const [categories, setCategories] = useState([]);
  const [hasActiveFreeship, setHasActiveFreeship] = useState(false);
  const [freeshipProductIds, setFreeshipProductIds] = useState(new Set());
  const [isFreeship, setIsFreeship] = useState(searchParams.get("isFreeship") === "true");

  // Lazy loading state
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Build filter key to detect when filters change
  const filterKey = [search, selectedCategory, minPrice, maxPrice, sortBy, isBestSeller, isNewProduct, isOnSale, isFreeship].join("|");

  // Fetch categories + freeship status once
  useEffect(() => {
    getCategoriesApi({ limit: 50 }).then((res) => {
      if (res.EC === 0) setCategories(res.data);
    });
    getActiveFreeshipApi().then((res) => {
      if (res?.EC === 0) {
        setHasActiveFreeship(res.data.hasFreeship);
        setFreeshipProductIds(new Set(res.data.productIds || []));
      }
    });
  }, []);

  // Core fetch function (uses current filter state via closure)
  const doFetch = useCallback(
    async (pg) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (pg === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pg, limit: 12, sortBy };
      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (isBestSeller) params.isBestSeller = true;
      if (isNewProduct) params.isNewProduct = true;
      if (isOnSale) params.isOnSale = true;
      if (isFreeship) params.isFreeship = true;

      const res = await getProductsApi(params);
      isFetchingRef.current = false;

      if (res.EC === 0) {
        setProducts((prev) => (pg === 1 ? res.data : [...prev, ...res.data]));
        setTotalProducts(res.pagination?.totalProducts ?? 0);
        setHasMore(pg < res.pagination?.totalPages);
        if (pg > 1) setPage(pg);
      }

      if (pg === 1) setLoading(false);
      else setLoadingMore(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey]
  );

  // When filters change: reset list and fetch page 1
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(false);
    isFetchingRef.current = false;
    doFetch(1);

    // Sync URL params
    const params = {};
    if (search) params.search = search;
    if (selectedCategory) params.category = selectedCategory;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy !== "-createdAt") params.sortBy = sortBy;
    if (isBestSeller) params.isBestSeller = true;
    if (isNewProduct) params.isNewProduct = true;
    if (isOnSale) params.isOnSale = true;
    if (isFreeship) params.isFreeship = true;
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // IntersectionObserver to trigger load-more
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingRef.current) {
          setPage((prev) => {
            const next = prev + 1;
            doFetch(next);
            return next;
          });
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, doFetch]);

  // Filter helpers
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const changeCategory = (val) => setSelectedCategory(val);
  const changeSortBy = (val) => setSortBy(val);
  const changeBestSeller = (val) => setIsBestSeller(val);
  const changeNewProduct = (val) => setIsNewProduct(val);

  const changeIsOnSale = (val) => setIsOnSale(val);
  const changeIsFreeship = (val) => setIsFreeship(val);

  const resetFilters = () => {
    setSearch(""); setSearchInput(""); setSelectedCategory("");
    setMinPrice(""); setMaxPrice("");
    setSortBy("-createdAt"); setIsBestSeller(false); setIsNewProduct(false); setIsOnSale(false); setIsFreeship(false);
  };

  const hasActiveFilters = search || selectedCategory || minPrice || maxPrice || isBestSeller || isNewProduct || isOnSale || isFreeship;
  const activeCategory = categories.find((c) => c._id === selectedCategory);

  const chipStyle = { background: "#e8ddd5", color: "#5a4a3f", padding: "5px 12px", fontSize: "0.8rem" };
  const chipBtnStyle = { background: "transparent", border: "none", color: "inherit", padding: "0 0 0 6px", lineHeight: 1, cursor: "pointer" };

  return (
    <div style={{ background: "#F9F3EC", minHeight: "100vh" }}>
      <div className="py-5" style={{ maxWidth: 1600, margin: "0 auto", padding: "40px 24px 40px 16px" }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Sản phẩm</li>
          </ol>
        </nav>

        {/* Top 10 Bán chạy + Xem nhiều */}
        <TopProductsSection />

        <div className="row g-4 mt-2">
          {/* Sidebar */}
          <div className="col-xl-2 col-lg-3" style={{ minWidth: 230 }}>
            <FilterCard title="Danh mục">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[{ _id: "", name: "Tất cả danh mục" }, ...categories].map((cat) => (
                  <label key={cat._id} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "5px 0" }}>
                    <input type="radio" name="category" checked={selectedCategory === cat._id}
                      onChange={() => changeCategory(cat._id)} />
                    <span style={{ fontSize: "0.88rem", color: selectedCategory === cat._id ? "#5a4a3f" : "#666", fontWeight: selectedCategory === cat._id ? 600 : 400 }}>
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </FilterCard>

            <FilterCard title="Khoảng giá">
              <form onSubmit={(e) => { e.preventDefault(); }}>
                <input type="number" className="form-control form-control-sm mb-2" placeholder="Giá từ (đ)"
                  value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min="0"
                  style={{ borderColor: "#e0d5ca", borderRadius: "8px" }} />
                <input type="number" className="form-control form-control-sm mb-2" placeholder="Giá đến (đ)"
                  value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min="0"
                  style={{ borderColor: "#e0d5ca", borderRadius: "8px" }} />
                <button className="btn btn-sm w-full rounded-2" type="submit"
                  style={{ background: "#f0e8df", color: "#5a4a3f", border: "none" }}
                  onClick={() => { /* trigger filter via state */ setSearch(search); }}>
                  Áp dụng
                </button>
              </form>
            </FilterCard>

            <FilterCard title="Lọc nhanh">
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
                <input type="checkbox" checked={isBestSeller}
                  onChange={(e) => changeBestSeller(e.target.checked)} />
                <span style={{ fontSize: "0.88rem" }}>🔥 Bán chạy nhất</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
                <input type="checkbox" checked={isNewProduct}
                  onChange={(e) => changeNewProduct(e.target.checked)} />
                <span style={{ fontSize: "0.88rem" }}>✨ Hàng mới về</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
                <input type="checkbox" checked={isOnSale}
                  onChange={(e) => changeIsOnSale(e.target.checked)} />
                <span style={{ fontSize: "0.88rem" }}>🏷️ Đang khuyến mãi</span>
              </label>
              {hasActiveFreeship && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={isFreeship}
                    onChange={(e) => changeIsFreeship(e.target.checked)} />
                  <span style={{ color: "#3a2e28", fontSize: "0.88rem" }}>🚚 Freeship toàn quốc</span>
                </label>
              )}
            </FilterCard>
          </div>

          {/* Product Grid */}
          <div className="col-xl-10 col-lg-9">
            {/* Heading + Search */}
            <div style={{ marginBottom: 20 }}>
              <h2 className="font-normal mb-3" style={{ color: "#3a2e28" }}>
                {activeCategory ? activeCategory.name : "Tất cả sản phẩm"}
              </h2>
              <form style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "nowrap" }} onSubmit={handleSearch}>
                <div style={{ display: "flex", alignItems: "center", flex: 1, background: "#fff", border: "1.5px solid #e0d5ca", borderRadius: 12, height: 44, padding: "0 14px", gap: 8 }}>
                  <iconify-icon icon="ph:magnifying-glass" style={{ color: "#bbb", fontSize: "1rem", flexShrink: 0 }}></iconify-icon>
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    style={{ flex: 1, border: 0, outline: "none", background: "transparent", fontSize: "0.88rem", color: "#3a2e28", boxShadow: "none" }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ height: 44, padding: "0 24px", background: "#5a4a3f", color: "#fff", border: "none", borderRadius: 12, fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", flexShrink: 0 }}
                >
                  Tìm
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{ height: 44, padding: "0 18px", background: "#fff", border: "1.5px solid #c8b8ac", color: "#5a4a3f", borderRadius: 12, fontSize: "0.88rem", fontWeight: 500, cursor: "pointer", flexShrink: 0 }}
                  >
                    Xóa lọc
                  </button>
                )}
              </form>
              {hasActiveFilters && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                  {search && (
                    <span className="badge rounded-pill d-flex align-items-center" style={chipStyle}>
                      {search}<button style={chipBtnStyle} onClick={() => { setSearch(""); setSearchInput(""); }}>×</button>
                    </span>
                  )}
                  {activeCategory && (
                    <span className="badge rounded-pill d-flex align-items-center" style={chipStyle}>
                      {activeCategory.name}<button style={chipBtnStyle} onClick={() => changeCategory("")}>×</button>
                    </span>
                  )}
                  {isBestSeller && (
                    <span className="badge rounded-pill d-flex align-items-center" style={{ ...chipStyle, background: "#ff6b35", color: "#fff" }}>
                      Bán chạy<button style={{ ...chipBtnStyle, color: "#fff" }} onClick={() => changeBestSeller(false)}>×</button>
                    </span>
                  )}
                  {isNewProduct && (
                    <span className="badge rounded-pill d-flex align-items-center" style={{ ...chipStyle, background: "#10b981", color: "#fff" }}>
                      Hàng mới<button style={{ ...chipBtnStyle, color: "#fff" }} onClick={() => changeNewProduct(false)}>×</button>
                    </span>
                  )}
                  {isOnSale && (
                    <span className="badge rounded-pill d-flex align-items-center" style={{ ...chipStyle, background: "#ef4444", color: "#fff" }}>
                      Khuyến mãi<button style={{ ...chipBtnStyle, color: "#fff" }} onClick={() => changeIsOnSale(false)}>×</button>
                    </span>
                  )}
                  {isFreeship && (
                    <span className="badge rounded-pill d-flex align-items-center" style={{ ...chipStyle, background: "#0891b2", color: "#fff" }}>
                      Freeship<button style={{ ...chipBtnStyle, color: "#fff" }} onClick={() => changeIsFreeship(false)}>×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sort bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <span className="text-gray-500 small">
                {loading ? "Đang tải..." : `Tìm thấy ${totalProducts} sản phẩm`}
              </span>
              <select
                className="text-sm"
                style={{ width: "auto", borderColor: "#e0d5ca", background: "#fff", border: "1.5px solid #e0d5ca", borderRadius: 10, padding: "6px 12px", color: "#5a4a3f", outline: "none", cursor: "pointer" }}
                value={sortBy} onChange={(e) => changeSortBy(e.target.value)}>
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-5" style={{ background: "#fff", borderRadius: "16px", color: "#888" }}>
                <iconify-icon icon="ph:package" style={{ fontSize: "3rem", color: "#ccc" }}></iconify-icon>
                <p className="mt-3">Không tìm thấy sản phẩm nào.</p>
                <button
                  className="rounded-xl font-medium text-sm transition-opacity hover:opacity-85"
                  style={{ padding: "8px 24px", background: "#5a4a3f", color: "#fff", border: "none", cursor: "pointer" }}
                  onClick={resetFilters}
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {products.map((product) => (
                    <div key={product._id} className="col-sm-6 col-lg-3">
                      <ProductCard
                        product={product}
                        showFreeship={
                          hasActiveFreeship && (
                            freeshipProductIds.size === 0 ||
                            freeshipProductIds.has(product._id)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>

                {/* Sentinel for IntersectionObserver */}
                <div ref={sentinelRef} style={{ height: 1 }} />

                {/* Load more indicator */}
                {loadingMore && (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary mr-2" role="status" />
                    <span className="text-gray-500 small">Đang tải thêm sản phẩm...</span>
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="text-center py-3">
                    <span className="text-gray-500 small">— Đã hiển thị tất cả {totalProducts} sản phẩm —</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
