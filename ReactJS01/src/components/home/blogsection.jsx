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
    <section style={{ background: "#fff", padding: "56px 0" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <p style={{ color: "#c8a87a", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600, marginBottom: 6 }}>
              Kiến thức thú cưng
            </p>
            <h2 style={{ color: "#3a2e28", fontWeight: 700, fontSize: "1.7rem", lineHeight: 1.2, margin: 0 }}>
              Bài viết mới nhất
            </h2>
          </div>
          <Link
            to="/blog"
            style={{ fontSize: "0.85rem", color: "#5a4a3f", border: "1.5px solid #5a4a3f", borderRadius: 20, padding: "6px 18px", textDecoration: "none" }}
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="row g-4">
          {posts.map((post) => {
            const date = new Date(post.publishedAt || post.createdAt);
            const day = String(date.getDate()).padStart(2, "0");
            const month = MONTHS_VI[date.getMonth()];
            return (
              <div key={post._id} className="col-md-4">
                <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{ borderRadius: 14, overflow: "hidden", background: "#f9f3ec", height: "100%", display: "flex", flexDirection: "column", transition: "box-shadow 0.22s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 22px rgba(0,0,0,0.10)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      {post.image ? (
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{ background: "#e8ddd5", width: "100%", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <iconify-icon icon="ph:newspaper" style={{ fontSize: "2.5rem", color: "#c8a87a" }}></iconify-icon>
                        </div>
                      )}
                      {/* Date badge */}
                      <div style={{ position: "absolute", top: 12, left: 12, background: "#fff", borderRadius: 8, padding: "6px 10px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#ff6b35", lineHeight: 1 }}>{day}</div>
                        <div style={{ fontSize: "0.7rem", color: "#5a4a3f", fontWeight: 600 }}>{month}</div>
                      </div>
                    </div>
                    {/* Body */}
                    <div style={{ padding: "18px 18px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h6 style={{ fontSize: "0.95rem", color: "#3a2e28", fontWeight: 600, lineHeight: 1.5, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.title}
                      </h6>
                      {post.excerpt && (
                        <p style={{ fontSize: "0.83rem", color: "#6b7280", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {post.excerpt}
                        </p>
                      )}
                      <span style={{ fontSize: "0.82rem", color: "#c8a87a", fontWeight: 600, marginTop: "auto" }}>
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
