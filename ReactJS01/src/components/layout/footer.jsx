import logo from '../../assets/logo.png';

function Footer() {
  return (
    <>
      <footer id="footer" className="my-5">
        <div className="container py-5 my-5">
          <div className="row">

            <div className="col-md-3">
              <div className="footer-menu">
                <img src={logo} alt="Waggy" />

                <p className="blog-paragraph fs-6 mt-3">
                  Đồ dùng và thức ăn thú cưng được chọn kỹ, dễ mua và giao tận nhà.
                </p>

                <div className="social-links">
                  <ul className="d-flex list-unstyled gap-2">

                    <li className="social">
                      <a href="#">
                        <iconify-icon
                          class="social-icon"
                          icon="ri:facebook-fill"
                        ></iconify-icon>
                      </a>
                    </li>

                    <li className="social">
                      <a href="#">
                        <iconify-icon
                          class="social-icon"
                          icon="ri:twitter-fill"
                        ></iconify-icon>
                      </a>
                    </li>

                    <li className="social">
                      <a href="#">
                        <iconify-icon
                          class="social-icon"
                          icon="ri:pinterest-fill"
                        ></iconify-icon>
                      </a>
                    </li>

                    <li className="social">
                      <a href="#">
                        <iconify-icon
                          class="social-icon"
                          icon="ri:instagram-fill"
                        ></iconify-icon>
                      </a>
                    </li>

                    <li className="social">
                      <a href="#">
                        <iconify-icon
                          class="social-icon"
                          icon="ri:youtube-fill"
                        ></iconify-icon>
                      </a>
                    </li>

                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="footer-menu">
                <h3>Liên kết nhanh</h3>

                <ul className="menu-list list-unstyled">
                  <li className="menu-item">
                    <a href="#" className="nav-link">Trang chủ</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Về cửa hàng</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Ưu đãi</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Dịch vụ</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Liên hệ</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-3">
              <div className="footer-menu">
                <h3>Hỗ trợ</h3>

                <ul className="menu-list list-unstyled">
                  <li className="menu-item">
                    <a href="#" className="nav-link">Câu hỏi thường gặp</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Thanh toán</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Đổi trả và hoàn tiền</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Đặt hàng</a>
                  </li>

                  <li className="menu-item">
                    <a href="#" className="nav-link">Thông tin giao hàng</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-3">
              <div>
                <h3>Nhận tin mới</h3>

                <p className="blog-paragraph fs-6">
                  Nhập email để nhận ưu đãi và gợi ý chăm sóc thú cưng.
                </p>

                <div className="search-bar border rounded-pill border-dark-subtle px-2">
                  <form
                    className="text-center d-flex align-items-center"
                    action=""
                    method=""
                  >
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent"
                      placeholder="Email của bạn"
                    />

                    <iconify-icon
                      class="send-icon"
                      icon="tabler:location-filled"
                    ></iconify-icon>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
