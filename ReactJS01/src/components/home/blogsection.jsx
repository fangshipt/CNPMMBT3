import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogsApi, getImageUrl } from "../../util/api";

const MONTHS_VI = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12'];

function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 3 }).then((res) => {
      if (res?.EC === 0) setPosts(res.data);
    });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="latest-blog" className="my-5">
      <div className="container py-5 my-5">
        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
          <h2 className="display-3 fw-normal">Bài viết mới nhất</h2>
          <div>
            <Link to="/blog" className="btn btn-outline-dark btn-lg rounded-1">
              Xem tất cả
              <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </Link>
          </div>
        </div>

        <div className="row">
          {posts.map((post) => {
            const date = new Date(post.publishedAt || post.createdAt);
            const day = String(date.getDate()).padStart(2, '0');
            const month = MONTHS_VI[date.getMonth()];
            return (
              <div className="col-md-4 my-4 my-md-0" key={post._id}>
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
      </div>
    </section>
  );
}

export default BlogSection;
