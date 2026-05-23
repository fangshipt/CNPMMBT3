import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProductsApi, getCategoriesApi } from "../util/api";
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
    <div className="mb-3 p-3" style={{ background: "#fff", borderRadius: "12px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      <h6 className="fw-bold mb-3 pb-2" style={{ borderBottom: "1px solid #f0e8df", color: "#5a4a3f" }}>
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
  const filterKey = [search, selectedCategory, minPrice, maxPrice, sortBy, isBestSeller, isNewProduct, isOnSale].join("|");

  // Fetch categories once
  useEffect(() => {
    getCategoriesApi({ limit: 50 }).then((res) => {
      if (res.EC === 0) setCategories(res.data);
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

  const resetFilters = () => {
    setSearch(""); setSearchInput(""); setSelectedCategory("");
    setMinPrice(""); setMaxPrice("");
    setSortBy("-createdAt"); setIsBestSeller(false); setIsNewProduct(false); setIsOnSale(false);
  };

  const hasActiveFilters = search || selectedCategory || minPrice || maxPrice || isBestSeller || isNewProduct || isOnSale;
  const activeCategory = categories.find((c) => c._id === selectedCategory);

  const chipStyle = { background: "#e8ddd5", color: "#5a4a3f", padding: "5px 12px", fontSize: "0.8rem" };
  const chipBtnStyle = { background: "transparent", border: "none", color: "inherit", padding: "0 0 0 6px", lineHeight: 1, cursor: "pointer" };

  return (
    <div style={{ background: "#F9F3EC", minHeight: "100vh" }}>
      <div className="py-5" style={{ maxWidth: 1600, margin: "0 auto", padding: "40px 32px" }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Sản phẩm</li>
          </ol>
        </nav>

        {/* Top 10 Bán chạy + Xem nhiều */}
        <TopProductsSection />

        {/* Heading + Search */}
        <div className="mb-4 mt-4">
          <h2 className="fw-normal mb-3" style={{ color: "#3a2e28" }}>
            {activeCategory ? activeCategory.name : "Tất cả sản phẩm"}
          </h2>

          <form className="d-flex gap-2" onSubmit={handleSearch}>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0" style={{ borderColor: "#e0d5ca", borderRadius: "10px 0 0 10px" }}>
                <iconify-icon icon="ph:magnifying-glass" style={{ color: "#aaa" }}></iconify-icon>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ borderColor: "#e0d5ca", borderRadius: "0 10px 10px 0", boxShadow: "none" }}
              />
            </div>
            <button className="btn btn-primary px-4 rounded-3" type="submit">Tìm</button>
            {hasActiveFilters && (
              <button className="btn rounded-3" type="button" onClick={resetFilters}
                style={{ border: "1px solid #c8b8ac", color: "#5a4a3f", background: "#fff" }}>
                Xóa lọc
              </button>
            )}
          </form>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="d-flex flex-wrap gap-2 mt-2">
              {search && (
                <span className="badge rounded-pill d-flex align-items-center" style={chipStyle}>
                  <iconify-icon icon="ph:magnifying-glass" class="me-1"></iconify-icon>{search}
                  <button style={chipBtnStyle} onClick={() => { setSearch(""); setSearchInput(""); }}>×</button>
                </span>
              )}
              {activeCategory && (
                <span className="badge rounded-pill d-flex align-items-center" style={chipStyle}>
                  <iconify-icon icon="ph:tag" class="me-1"></iconify-icon>{activeCategory.name}
                  <button style={chipBtnStyle} onClick={() => changeCategory("")}>×</button>
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
                  🏷️ Khuyến mãi<button style={{ ...chipBtnStyle, color: "#fff" }} onClick={() => changeIsOnSale(false)}>×</button>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-xl-2 col-lg-3" style={{ minWidth: 200 }}>
            <FilterCard title="Danh mục">
              <div className="d-flex flex-column gap-1">
                {[{ _id: "", name: "Tất cả danh mục" }, ...categories].map((cat) => (
                  <label key={cat._id} className="d-flex align-items-center gap-2" style={{ cursor: "pointer", padding: "4px 0" }}>
                    <input type="radio" name="category" checked={selectedCategory === cat._id}
                      onChange={() => changeCategory(cat._id)} />
                    <span style={{ color: selectedCategory === cat._id ? "#5a4a3f" : "#666", fontWeight: selectedCategory === cat._id ? 600 : 400 }}>
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
                <button className="btn btn-sm w-100 rounded-2" type="submit"
                  style={{ background: "#f0e8df", color: "#5a4a3f", border: "none" }}
                  onClick={() => { /* trigger filter via state */ setSearch(search); }}>
                  Áp dụng
                </button>
              </form>
            </FilterCard>

            <FilterCard title="Lọc nhanh">
              <label className="d-flex align-items-center gap-2 mb-2" style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={isBestSeller}
                  onChange={(e) => changeBestSeller(e.target.checked)} />
                <span>🔥 Bán chạy nhất</span>
              </label>
              <label className="d-flex align-items-center gap-2 mb-2" style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={isNewProduct}
                  onChange={(e) => changeNewProduct(e.target.checked)} />
                <span>✨ Hàng mới về</span>
              </label>
              <label className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                <input type="checkbox" checked={isOnSale}
                  onChange={(e) => changeIsOnSale(e.target.checked)} />
                <span>🏷️ Đang khuyến mãi</span>
              </label>
            </FilterCard>
          </div>

          {/* Product Grid */}
          <div className="col-xl-10 col-lg-9">
            {/* Sort bar */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <span className="text-muted small">
                {loading ? "Đang tải..." : `Tìm thấy ${totalProducts} sản phẩm`}
              </span>
              <select className="form-select form-select-sm rounded-3" style={{ width: "auto", borderColor: "#e0d5ca", background: "#fff" }}
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
                <button className="btn btn-outline-primary rounded-3" onClick={resetFilters}>Xóa bộ lọc</button>
              </div>
            ) : (
              <>
                <div className="row g-3">
                  {products.map((product) => (
                    <div key={product._id} className="col-sm-6 col-lg-3">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Sentinel for IntersectionObserver */}
                <div ref={sentinelRef} style={{ height: 1 }} />

                {/* Load more indicator */}
                {loadingMore && (
                  <div className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status" />
                    <span className="text-muted small">Đang tải thêm sản phẩm...</span>
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="text-center py-3">
                    <span className="text-muted small">— Đã hiển thị tất cả {totalProducts} sản phẩm —</span>
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
