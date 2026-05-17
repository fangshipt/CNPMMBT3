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
                Free Delivery
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Lorem ipsum dolor sit amet, consectetur adipi elit.
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
                100% secure payment
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Lorem ipsum dolor sit amet, consectetur adipi elit.
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
                Daily Offer
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Lorem ipsum dolor sit amet, consectetur adipi elit.
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
                Quality guarantee
              </h3>

              <div className="card-text">
                <p className="blog-paragraph fs-6">
                  Lorem ipsum dolor sit amet, consectetur adipi elit.
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