import { Link } from "react-router-dom";

function ContactPage() {
  return (
    <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 860 }}>
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
            <li className="breadcrumb-item active">Liên hệ</li>
          </ol>
        </nav>

        <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
          <h1 className="fw-normal mb-2" style={{ color: '#3a2e28' }}>Liên hệ với chúng tôi</h1>
          <p className="text-muted mb-5">Chúng tôi rất sẵn lòng lắng nghe và hỗ trợ bạn về mọi thắc mắc liên quan đến sản phẩm và dịch vụ.</p>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex gap-3 align-items-start p-4 rounded-3" style={{ background: '#FFF8F0', height: '100%' }}>
                <div style={{ width: 48, height: 48, background: '#DEAD6F20', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <iconify-icon icon="ph:map-pin" style={{ fontSize: '1.5rem', color: '#DEAD6F' }}></iconify-icon>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#3a2e28' }}>Địa chỉ cửa hàng</h6>
                  <p className="mb-0 text-muted">Số 1 Võ Văn Ngân, Thủ Đức, TP. Hồ Chí Minh</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex gap-3 align-items-start p-4 rounded-3" style={{ background: '#FFF8F0', height: '100%' }}>
                <div style={{ width: 48, height: 48, background: '#DEAD6F20', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <iconify-icon icon="ph:phone" style={{ fontSize: '1.5rem', color: '#DEAD6F' }}></iconify-icon>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#3a2e28' }}>Điện thoại</h6>
                  <a href="tel:0867777777" className="text-decoration-none" style={{ color: '#5a4a3f' }}>0867 777 777</a>
                  <p className="mb-0 text-muted small mt-1">Thứ 2 – Chủ nhật: 8:00 – 20:00</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex gap-3 align-items-start p-4 rounded-3" style={{ background: '#FFF8F0', height: '100%' }}>
                <div style={{ width: 48, height: 48, background: '#DEAD6F20', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <iconify-icon icon="ph:envelope" style={{ fontSize: '1.5rem', color: '#DEAD6F' }}></iconify-icon>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#3a2e28' }}>Email</h6>
                  <a href="mailto:fangshipetshop@gmail.com" className="text-decoration-none" style={{ color: '#5a4a3f' }}>fangshipetshop@gmail.com</a>
                  <p className="mb-0 text-muted small mt-1">Phản hồi trong vòng 24 giờ</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex gap-3 align-items-start p-4 rounded-3" style={{ background: '#FFF8F0', height: '100%' }}>
                <div style={{ width: 48, height: 48, background: '#DEAD6F20', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <iconify-icon icon="ph:clock" style={{ fontSize: '1.5rem', color: '#DEAD6F' }}></iconify-icon>
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: '#3a2e28' }}>Giờ làm việc</h6>
                  <p className="mb-0 text-muted">Thứ 2 – Thứ 6: 8:00 – 20:00</p>
                  <p className="mb-0 text-muted">Thứ 7 – Chủ nhật: 9:00 – 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-3 text-center" style={{ background: 'linear-gradient(135deg, #FFF8F0, #f0e8df)' }}>
            <iconify-icon icon="ph:paw-print" style={{ fontSize: '2.5rem', color: '#DEAD6F' }}></iconify-icon>
            <p className="mt-3 mb-0" style={{ color: '#5a4a3f', fontStyle: 'italic' }}>
              Chúng tôi rất sẵn lòng giúp bạn tìm sản phẩm phù hợp nhất cho thú cưng của mình. Đừng ngại liên hệ!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
