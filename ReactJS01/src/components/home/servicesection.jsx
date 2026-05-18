function Service() {
  return (
    <section id="service">
      <div className="container py-5 my-5">

        <div className="row g-md-5 pt-4">

          {/* Card 1 */}
          <div className="col-md-3 my-3">
            <div className="card">

              <div>
                <iconify-icon
                  class="service-icon text-primary"
                  icon="la:shopping-cart"
                ></iconify-icon>
              </div>

              <h3 className="card-title py-2 m-0">
                Giao hàng tiện lợi
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Hỗ trợ giao tận nhà, phù hợp với đơn hàng trong khu vực.
                </p>
              </div>

            </div>
          </div>

          {/* Card 2 */}
          <div className="col-md-3 my-3">
            <div className="card">

              <div>
                <iconify-icon
                  class="service-icon text-primary"
                  icon="la:user-check"
                ></iconify-icon>
              </div>

              <h3 className="card-title py-2 m-0">
                Thanh toán an toàn
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Thông tin đơn hàng được xử lý rõ ràng và bảo mật.
                </p>
              </div>

            </div>
          </div>

          {/* Card 3 */}
          <div className="col-md-3 my-3">
            <div className="card">

              <div>
                <iconify-icon
                  class="service-icon text-primary"
                  icon="la:tag"
                ></iconify-icon>
              </div>

              <h3 className="card-title py-2 m-0">
                Ưu đãi hằng ngày
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Luôn có vài món giá tốt để bạn dễ chọn cho các bé.
                </p>
              </div>

            </div>
          </div>

          {/* Card 4 */}
          <div className="col-md-3 my-3">
            <div className="card">

              <div>
                <iconify-icon
                  class="service-icon text-primary"
                  icon="la:award"
                ></iconify-icon>
              </div>

              <h3 className="card-title py-2 m-0">
                Cam kết chất lượng
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Sản phẩm được chọn kỹ, hình ảnh và mô tả dễ kiểm tra.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Service;
