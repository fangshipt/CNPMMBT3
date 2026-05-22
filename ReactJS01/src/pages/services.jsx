import { Link } from "react-router-dom";

const SERVICES = [
  {
    icon: 'ph:scissors',
    title: 'Grooming & Tắm sấy',
    description: 'Dịch vụ tắm, sấy, cắt tỉa lông chuyên nghiệp cho chó và mèo. Thú cưng của bạn sẽ luôn sạch sẽ và thơm tho.',
    badge: 'Phổ biến',
    badgeColor: '#10b981',
  },
  {
    icon: 'ph:first-aid-kit',
    title: 'Tư vấn sức khỏe',
    description: 'Đội ngũ có kinh nghiệm sẵn sàng tư vấn về dinh dưỡng, sức khỏe và chăm sóc thú cưng phù hợp với từng giống loài.',
    badge: '',
    badgeColor: '',
  },
  {
    icon: 'ph:house',
    title: 'Trông giữ thú cưng',
    description: 'Dịch vụ trông giữ thú cưng an toàn, tiện lợi khi bạn bận hoặc đi du lịch. Không gian thoáng mát, vui chơi đầy đủ.',
    badge: 'Mới',
    badgeColor: '#3b82f6',
  },
  {
    icon: 'ph:truck',
    title: 'Giao hàng tận nơi',
    description: 'Giao hàng nhanh trong ngày tại TP.HCM. Đảm bảo sản phẩm được đóng gói cẩn thận, an toàn đến tay bạn.',
    badge: '',
    badgeColor: '',
  },
  {
    icon: 'ph:camera',
    title: 'Chụp ảnh thú cưng',
    description: 'Lưu giữ những khoảnh khắc đáng yêu của thú cưng với dịch vụ chụp ảnh chuyên nghiệp ngay tại cửa hàng.',
    badge: '',
    badgeColor: '',
  },
  {
    icon: 'ph:graduation-cap',
    title: 'Huấn luyện & Training',
    description: 'Chương trình huấn luyện cơ bản giúp thú cưng nghe lời, xây dựng thói quen tốt và tăng cường kết nối với chủ.',
    badge: '',
    badgeColor: '',
  },
];

function ServicesPage() {
  return (
    <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 1000 }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Dịch vụ</li>
          </ol>
        </nav>

        <div className="text-center mb-5">
          <iconify-icon icon="ph:sparkle" style={{ fontSize: '2.5rem', color: '#DEAD6F' }}></iconify-icon>
          <h1 className="fw-normal mt-3 mb-2" style={{ color: '#3a2e28' }}>Dịch vụ của chúng tôi</h1>
          <p className="text-muted">Chúng tôi cung cấp đa dạng dịch vụ để chăm sóc toàn diện cho thú cưng của bạn</p>
        </div>

        <div className="row g-4">
          {SERVICES.map((service, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="bg-white rounded-4 p-4 h-100 position-relative" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
              >
                {service.badge && (
                  <span className="badge position-absolute" style={{ top: 16, right: 16, background: service.badgeColor, fontSize: '0.72rem' }}>
                    {service.badge}
                  </span>
                )}
                <div style={{ width: 56, height: 56, background: '#FFF8F0', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <iconify-icon icon={service.icon} style={{ fontSize: '1.6rem', color: '#DEAD6F' }}></iconify-icon>
                </div>
                <h5 className="fw-semibold mb-2" style={{ color: '#3a2e28' }}>{service.title}</h5>
                <p className="text-muted mb-0" style={{ lineHeight: 1.7, fontSize: '0.9rem' }}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 bg-white rounded-4 p-4 p-md-5 text-center" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h4 className="fw-normal mb-2" style={{ color: '#3a2e28' }}>Cần thêm thông tin?</h4>
          <p className="text-muted mb-4">Liên hệ với chúng tôi để được tư vấn và báo giá chi tiết cho từng dịch vụ.</p>
          <Link to="/contact" className="btn btn-primary rounded-2 px-4">
            <iconify-icon icon="ph:phone" class="me-2"></iconify-icon>
            Liên hệ ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
