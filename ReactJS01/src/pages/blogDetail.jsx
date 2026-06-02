import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogBySlugApi, getImageUrl } from "../util/api";
import Loading from "../components/common/loading";

function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    getBlogBySlugApi(slug).then((res) => {
      if (res?.EC === 0) setPost(res.data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div style={{ background: '#F9F3EC', minHeight: '100vh' }} className="py-5"><div className="container"><Loading /></div></div>;

  if (!post) {
    return (
      <div style={{ background: '#F9F3EC', minHeight: '100vh' }} className="py-5">
        <div className="container text-center">
          <p className="text-gray-500">Không tìm thấy bài viết.</p>
          <Link to="/blog" className="btn btn-primary">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  const date = new Date(post.publishedAt || post.createdAt);

  return (
    <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 860 }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item"><Link to="/blog">Bài viết</Link></li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: 200 }}>{post.title}</li>
          </ol>
        </nav>

        <article className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          <h1 className="font-normal mb-3" style={{ color: '#3a2e28', lineHeight: 1.4 }}>{post.title}</h1>

          <div className="flex items-center gap-3 mb-4 text-gray-500 small">
            {post.author?.fullName && (
              <span>
                <iconify-icon icon="ph:user-circle" class="mr-1"></iconify-icon>
                {post.author.fullName}
              </span>
            )}
            <span>
              <iconify-icon icon="ph:calendar" class="mr-1"></iconify-icon>
              {date.toLocaleDateString('vi-VN')}
            </span>
          </div>

          {post.image && (
            <img
              src={getImageUrl(post.image)}
              alt={post.title}
              className="rounded-3 mb-4"
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
            />
          )}

          {post.excerpt && (
            <p className="lead mb-4 text-gray-500" style={{ borderLeft: '4px solid #DEAD6F', paddingLeft: '1rem' }}>
              {post.excerpt}
            </p>
          )}

          {post.content && (
            <div
              className="blog-content"
              style={{ lineHeight: 1.85, color: '#3a2e28' }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </article>

        <div className="mt-4">
          <Link to="/blog" className="btn btn-outline-secondary rounded-2">
            <iconify-icon icon="ph:arrow-left" class="mr-1"></iconify-icon>
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;
