import { useState, useEffect, useContext } from "react";
import { Modal, Rate, message } from "antd";
import { getPublicTestimonialsApi, getTestimonialStatusApi, createTestimonialApi } from "../../util/api";
import { AuthContext } from "../context/authContext";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Testimonial() {
  const { auth } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getPublicTestimonialsApi(6).then((res) => {
      if (res?.EC === 0) setReviews(res.data);
    });
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated || dismissed) return;
    const alreadyDismissed = sessionStorage.getItem('testimonial_dismissed');
    if (alreadyDismissed) return;

    getTestimonialStatusApi().then((res) => {
      if (res?.EC === 0 && res.data.hasDeliveredOrder && !res.data.hasSubmitted) {
        setTimeout(() => setModalOpen(true), 2000);
      }
    }).catch(() => {});
  }, [auth.isAuthenticated, dismissed]);

  const handleDismiss = () => {
    setModalOpen(false);
    setDismissed(true);
    sessionStorage.setItem('testimonial_dismissed', '1');
  };

  const handleSubmit = async () => {
    if (!content.trim()) { message.warning('Vui lòng nhập nội dung lời nhắn'); return; }
    setSubmitting(true);
    const res = await createTestimonialApi({ content: content.trim(), rating });
    setSubmitting(false);
    if (res?.EC === 0) {
      message.success('Cảm ơn bạn đã gửi lời nhắn! Lời nhắn sẽ hiển thị sau khi được duyệt.');
      setModalOpen(false);
      setDismissed(true);
      sessionStorage.setItem('testimonial_dismissed', '1');
    } else {
      message.error(res?.EM || 'Có lỗi xảy ra');
    }
  };

  const displayReviews = reviews.length > 0 ? reviews : [];
  if (displayReviews.length === 0) return null;

  return (
    <>
      <section id="testimonial" className="testimonial-section">
        <div className="container my-5 py-5">
          <div className="section-header text-center mb-5">
            <p className="secondary-font text-primary text-uppercase mb-2">Khách hàng chia sẻ</p>
            <h2 className="display-4 font-normal mb-3">Những lời nhắn nhỏ từ người nuôi thú cưng</h2>
            <p className="testimonial-intro secondary-font mx-auto">
              Tụi mình luôn muốn mỗi đơn hàng đến tay bạn thật gọn gàng, dễ chọn và hợp với thói quen chăm sóc các bé ở Việt Nam.
            </p>
          </div>

          <div className="row g-4">
            {displayReviews.map((review) => (
              <div className="col-md-4" key={review._id}>
                <article className="testimonial-card h-full">
                  <div className="testimonial-rating mb-3" aria-label={`${review.rating} sao`}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="testimonial-content">"{review.content}"</p>
                  <div className="testimonial-author">
                    <img
                      src={review.user?.avatar || DEFAULT_AVATAR}
                      alt={review.user?.fullName}
                      className="testimonial-avatar"
                      onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                    />
                    <div>
                      <h3 className="testimonial-name mb-0">{review.user?.fullName || 'Khách hàng'}</h3>
                      <p className="testimonial-location secondary-font mb-0">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        open={modalOpen}
        onCancel={handleDismiss}
        footer={null}
        width={480}
        centered
      >
        <div className="text-center mb-4">
          <iconify-icon icon="ph:paw-print" style={{ fontSize: '2.5rem', color: '#DEAD6F' }}></iconify-icon>
          <h5 className="font-semibold mt-3 mb-1" style={{ color: '#3a2e28' }}>Bạn có muốn gửi lời nhắn?</h5>
          <p className="text-gray-500 small">Đơn hàng của bạn đã được giao thành công. Hãy chia sẻ trải nghiệm của bạn với chúng tôi!</p>
        </div>

        <div className="mb-3 text-center">
          <label className="text-gray-500 small block mb-2">Đánh giá trải nghiệm mua sắm</label>
          <Rate value={rating} onChange={setRating} style={{ color: '#f59e0b', fontSize: '1.5rem' }} />
        </div>

        <div className="mb-4">
          <textarea
            className="form-control"
            rows={4}
            placeholder="Chia sẻ cảm nhận của bạn về dịch vụ và sản phẩm..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ borderColor: '#e0d5ca', borderRadius: '10px', resize: 'none' }}
          />
        </div>

        <div className="flex gap-2">
          <button className="btn btn-outline-secondary rounded-2 flex-1" onClick={handleDismiss}>
            Để sau
          </button>
          <button
            className="btn btn-primary rounded-2 flex-1"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Đang gửi...' : 'Gửi lời nhắn'}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Testimonial;
