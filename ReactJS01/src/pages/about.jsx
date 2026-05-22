import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 900 }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Về cửa hàng</li>
          </ol>
        </nav>

        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          <div className="text-center mb-5">
            <iconify-icon icon="ph:paw-print" style={{ fontSize: '3rem', color: '#DEAD6F' }}></iconify-icon>
            <h1 className="fw-normal mt-3 mb-2" style={{ color: '#3a2e28' }}>Về cửa hàng PetStore</h1>
            <p className="text-muted">Nơi những người yêu thú cưng tìm thấy điều họ cần</p>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-md-6">
              <h4 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Câu chuyện của chúng tôi</h4>
              <p className="text-muted" style={{ lineHeight: 1.8 }}>
                PetStore được thành lập bởi những người yêu thú cưng với mong muốn mang đến cho các bé những sản phẩm chất lượng nhất.
                Chúng tôi hiểu rằng thú cưng là một phần không thể thiếu trong gia đình, vì vậy mọi sản phẩm đều được chọn lọc kỹ càng để đảm bảo an toàn và phù hợp nhất.
              </p>
              <p className="text-muted" style={{ lineHeight: 1.8 }}>
                Từ thức ăn, đồ chơi đến phụ kiện và sản phẩm chăm sóc — chúng tôi cung cấp đầy đủ mọi thứ bạn cần cho những người bạn bốn chân của mình.
              </p>
            </div>
            <div className="col-md-6">
              <div className="p-4 rounded-3 h-100" style={{ background: '#FFF8F0' }}>
                <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Tại sao chọn PetStore?</h5>
                {[
                  { icon: 'ph:check-circle', text: 'Sản phẩm được kiểm định chất lượng' },
                  { icon: 'ph:truck', text: 'Giao hàng nhanh, đóng gói cẩn thận' },
                  { icon: 'ph:headset', text: 'Tư vấn tận tâm, hỗ trợ 7 ngày/tuần' },
                  { icon: 'ph:shield-check', text: 'Đổi trả dễ dàng trong 7 ngày' },
                  { icon: 'ph:tag', text: 'Giá cả cạnh tranh, nhiều ưu đãi hấp dẫn' },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 mb-2">
                    <iconify-icon icon={item.icon} style={{ fontSize: '1.1rem', color: '#DEAD6F', flexShrink: 0 }}></iconify-icon>
                    <span className="text-muted">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-3 text-center mb-5">
            {[
              { icon: 'ph:storefront', value: '2020', label: 'Năm thành lập' },
              { icon: 'ph:users', value: '5,000+', label: 'Khách hàng tin tưởng' },
              { icon: 'ph:package', value: '500+', label: 'Sản phẩm đa dạng' },
              { icon: 'ph:star', value: '4.8/5', label: 'Đánh giá trung bình' },
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="p-3 rounded-3" style={{ background: '#FFF8F0' }}>
                  <iconify-icon icon={stat.icon} style={{ fontSize: '1.8rem', color: '#DEAD6F' }}></iconify-icon>
                  <div className="fw-bold mt-2" style={{ fontSize: '1.3rem', color: '#3a2e28' }}>{stat.value}</div>
                  <div className="text-muted small">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/products" className="btn btn-primary rounded-2 px-4 me-2">Xem sản phẩm</Link>
            <Link to="/contact" className="btn btn-outline-secondary rounded-2 px-4">Liên hệ chúng tôi</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
