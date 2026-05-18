import item1 from "../../assets/item1.jpg";
import item2 from "../../assets/item2.jpg";
import item3 from "../../assets/item3.jpg";
import item4 from "../../assets/item4.jpg";

const products = [
  {
    id: 1,
    name: "Áo hoodie xám",
    price: "129.000đ",
    label: "Phụ kiện",
    image: item1,
  },
  {
    id: 2,
    name: "Áo hoodie mềm",
    price: "139.000đ",
    label: "Hàng mới",
    image: item2,
  },
  {
    id: 3,
    name: "Khăn lau nhanh",
    price: "75.000đ",
    label: "Chăm sóc",
    image: item3,
  },
  {
    id: 4,
    name: "Túi đựng đồ ăn",
    price: "99.000đ",
    label: "Tiện dụng",
    image: item4,
  },
];

function NewestProduct() {
  return (
    <section id="newest-products" className="my-5 py-5">
      <div className="container">
        <div className="section-header text-center mb-5">
          <p className="secondary-font text-primary mb-2">Vừa lên kệ</p>
          <h2 className="section-title mb-0">Sản phẩm mới cho bé</h2>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <article className="card product-showcase-card h-100 text-center">
                <a href="#">
                  <img
                    src={product.image}
                    className="img-fluid rounded-4 product-showcase-image"
                    alt={product.name}
                  />
                </a>

                <div className="card-body px-0 pb-0">
                  <div className="product-label mb-3">{product.label}</div>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-primary fw-bold product-price">
                    {product.price}
                  </p>
                  <button className="btn btn-outline-primary btn-sm">
                    Thêm vào giỏ
                  </button>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewestProduct;
