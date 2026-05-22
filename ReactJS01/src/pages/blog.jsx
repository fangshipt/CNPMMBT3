import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogsApi, getImageUrl } from "../util/api";
import Loading from "../components/common/loading";

const MONTHS_VI = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getPublishedBlogsApi({ page, limit: 9 }).then((res) => {
      if (res?.EC === 0) {
        setPosts(res.data);
        setTotalPages(res.meta?.totalPages || 1);
      }
      setLoading(false);
    });
  }, [page]);

  return (
    <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="mb-4">
          <h1 className="fw-normal" style={{ color: '#3a2e28' }}>Bài viết</h1>
          <p className="text-muted">Kiến thức và mẹo chăm sóc thú cưng</p>
        </div>

        {loading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <iconify-icon icon="ph:newspaper" style={{ fontSize: '3rem' }}></iconify-icon>
            <p className="mt-3">Chưa có bài viết nào.</p>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {posts.map((post) => {
                const date = new Date(post.publishedAt || post.createdAt);
                const day = String(date.getDate()).padStart(2, '0');
                const month = MONTHS_VI[date.getMonth()];
                return (
                  <div key={post._id} className="col-md-6 col-lg-4">
                    <article className="card blog-card position-relative h-100">
                      <div className="blog-date position-absolute">
                        <h3 className="secondary-font text-primary m-0">{day}</h3>
                        <p className="secondary-font fs-6 m-0">{month}</p>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        {post.image ? (
                          <img
                            src={getImageUrl(post.image)}
                            className="img-fluid rounded-4 blog-image"
                            alt={post.title}
                            style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="rounded-4 blog-image" style={{ background: '#f0e8df', width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <iconify-icon icon="ph:newspaper" style={{ fontSize: '3rem', color: '#c8a87a' }}></iconify-icon>
                          </div>
                        )}
                      </Link>
                      <div className="card-body p-0">
                        <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3 className="card-title pt-4 pb-3 m-0">{post.title}</h3>
                        </Link>
                        <div className="card-text">
                          {post.excerpt && <p className="blog-paragraph fs-6">{post.excerpt}</p>}
                          <Link to={`/blog/${post.slug}`} className="blog-read">Đọc tiếp</Link>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-5">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`btn btn-sm rounded-2 ${page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BlogPage;
