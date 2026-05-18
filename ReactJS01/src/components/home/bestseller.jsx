import item5 from "../../assets/item5.jpg";
import item6 from "../../assets/item6.jpg";
import item7 from "../../assets/item7.jpg";
import item8 from "../../assets/item8.jpg";

const bestSellers = [
  {
    id: 1,
    name: "Nhà gỗ ấm cho mèo",
    price: "329.000đ",
    rating: "5.0",
    image: item5,
  },
  {
    id: 2,
    name: "Pate mềm vị gà",
    price: "45.000đ",
    rating: "4.9",
    image: item6,
  },
  {
    id: 3,
    name: "Áo giữ ấm nhỏ",
    price: "149.000đ",
    rating: "5.0",
    image: item7,
    badge: "Giảm giá",
  },
  {
    id: 4,
    name: "Áo họa tiết mùa hè",
    price: "159.000đ",
    rating: "4.8",
    image: item8,
  },
];

function BestSelling() {
  return (
    <section id="bestselling" className="my-5 overflow-hidden">
      <div className="container py-5 mb-5">
        <div className="section-header d-md-flex justify-content-between align-items-center mb-3">
          <h2 className="display-3 fw-normal">Sản phẩm bán chạy nhất</h2>

          <div>
            <a
              href="#"
              className="btn btn-outline-dark btn-lg rounded-1"
            >
              Xem thêm
              <svg width="24" height="24" viewBox="0 0 24 24" className="mb-1">
                <use xlinkHref="#arrow-right"></use>
              </svg>
            </a>
          </div>
        </div>

        <div className="row g-4">
          {bestSellers.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-3">
              <article className="card product-showcase-card position-relative h-100">
                {item.badge && (
                  <div className="product-badge position-absolute">
                    {item.badge}
                  </div>
                )}

                <a href="#">
                  <img
                    src={item.image}
                    className="img-fluid rounded-4 product-showcase-image"
                    alt={item.name}
                  />
                </a>

                <div className="card-body px-0 pb-0">
                  <a href="#">
                    <h3 className="card-title pt-4 m-0">{item.name}</h3>
                  </a>

                  <div className="card-text">
                    <span className="rating secondary-font">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <iconify-icon
                          icon="clarity:star-solid"
                          class="text-primary"
                          key={star}
                        ></iconify-icon>
                      ))}
                      {" "}{item.rating}
                    </span>

                    <h3 className="secondary-font text-primary product-price">
                      {item.price}
                    </h3>

                    <div className="d-flex flex-wrap gap-3 mt-3">
                      <a href="#" className="btn-cart px-4 py-3">
                        <h5 className="m-0">Thêm vào giỏ</h5>
                      </a>

                      <a href="#" className="btn-wishlist px-4 py-3">
                        <iconify-icon
                          icon="fluent:heart-28-filled"
                          class="fs-5"
                        ></iconify-icon>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSelling;
