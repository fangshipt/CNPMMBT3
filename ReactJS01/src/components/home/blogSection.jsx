import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogsApi, getImageUrl } from "../../util/api";

const MONTHS_VI = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];

function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 3, sortBy: "-publishedAt" }).then((res) => {
      if (res?.EC === 0) setPosts(res.data || []);
    });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section style={{ background: "#fdf4ec", padding: "52px 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, color: "#c8a87a", marginBottom: 4 }}>
              Kiến thức thú cưng
            </p>
            <h2 style={{ fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.2, margin: 0, color: "#3a2e28" }}>
              Bài viết mới nhất
            </h2>
          </div>
          <Link
            to="/blog"
            className="no-underline"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.84rem", fontWeight: 500, color: "#5a4a3f", border: "1.5px solid #5a4a3f", borderRadius: 999, padding: "8px 22px", background: "transparent", transition: "all 0.2s", whiteSpace: "nowrap" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#5a4a3f"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a4a3f"; }}
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Grid */}
        <div className="row g-4">
          {posts.map((post) => {
            const date = new Date(post.publishedAt || post.createdAt);
            const day = String(date.getDate()).padStart(2, "0");
            const month = MONTHS_VI[date.getMonth()];
            return (
              <div key={post._id} className="col-md-4">
                <Link to={`/blog/${post.slug}`} className="no-underline d-block h-100">
                  <div
                    className="rounded-[16px] overflow-hidden h-100 d-flex flex-column"
                    style={{ background: "#fff", boxShadow: "0 2px 12px rgba(58,46,40,0.07)", transition: "box-shadow 0.2s, transform 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(58,46,40,0.13)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(58,46,40,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Image 16:9 */}
                    <div style={{ position: "relative", paddingBottom: "56.25%", overflow: "hidden", background: "#f0e6da", flexShrink: 0 }}>
                      {post.image ? (
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <iconify-icon icon="ph:newspaper" style={{ fontSize: "2.5rem", color: "#c8a87a" }}></iconify-icon>
                        </div>
                      )}
                      {/* Date badge */}
                      <div style={{ position: "absolute", top: 12, left: 12, background: "#fff", borderRadius: 8, padding: "6px 10px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1, color: "#ff6b35" }}>{day}</div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#5a4a3f" }}>{month}</div>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "16px 18px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <h6 style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.5, color: "#3a2e28", margin: "0 0 8px 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {post.title}
                      </h6>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.83rem", color: "#8a7060", lineHeight: 1.6, margin: "0 0 12px 0", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {post.excerpt}
                        </p>
                      )}
                      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#c8a87a", marginTop: "auto" }}>
                        Đọc tiếp →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
