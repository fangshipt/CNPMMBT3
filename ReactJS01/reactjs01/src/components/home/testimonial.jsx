function Testimonial() {
  return (
    <section id="testimonial">
      <div className="container my-5 py-5">
        <div className="row">

          <div className="offset-md-1 col-md-10">
            <div className="swiper testimonial-swiper">

              <div className="swiper-wrapper">

                {/* Slide 1 */}
                <div className="swiper-slide">
                  <div className="row">

                    <div className="col-2">
                      <iconify-icon
                        icon="ri:double-quotes-l"
                        class="quote-icon text-primary"
                      ></iconify-icon>
                    </div>

                    <div className="col-md-10 mt-md-5 p-5 pt-0 pt-md-5">
                      <p className="testimonial-content fs-2">
                        At the core of our practice is the idea that cities are
                        the incubators of our greatest achievements, and the
                        best hope for a sustainable future.
                      </p>

                      <p className="text-black">- Joshima Lin</p>
                    </div>

                  </div>
                </div>

                {/* Slide 2 */}
                <div className="swiper-slide">
                  <div className="row">

                    <div className="col-2">
                      <iconify-icon
                        icon="ri:double-quotes-l"
                        class="quote-icon text-primary"
                      ></iconify-icon>
                    </div>

                    <div className="col-md-10 mt-md-5 p-5 pt-0 pt-md-5">
                      <p className="testimonial-content fs-2">
                        At the core of our practice is the idea that cities are
                        the incubators of our greatest achievements, and the
                        best hope for a sustainable future.
                      </p>

                      <p className="text-black">- Joshima Lin</p>
                    </div>

                  </div>
                </div>

                {/* Slide 3 */}
                <div className="swiper-slide">
                  <div className="row">

                    <div className="col-2">
                      <iconify-icon
                        icon="ri:double-quotes-l"
                        class="quote-icon text-primary"
                      ></iconify-icon>
                    </div>

                    <div className="col-md-10 mt-md-5 p-5 pt-0 pt-md-5">
                      <p className="testimonial-content fs-2">
                        At the core of our practice is the idea that cities are
                        the incubators of our greatest achievements, and the
                        best hope for a sustainable future.
                      </p>

                      <p className="text-black">- Joshima Lin</p>
                    </div>

                  </div>
                </div>

              </div>

              <div className="swiper-pagination"></div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Testimonial;