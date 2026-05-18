import item1 from "../../assets/item1.jpg";

function ProductCard() {
  return (
    <div className="card position-relative">

      <a href="single-product.html">
        <img
          src={item1}
          className="img-fluid rounded-4"
          alt="Sản phẩm thú cưng"
        />
      </a>

      <div className="card-body p-0">

        <a href="single-product.html">
          <h3 className="card-title pt-4 m-0">
            Áo hoodie xám
          </h3>
        </a>

        <div className="card-text">

          <span className="rating secondary-font">

            <iconify-icon
              icon="clarity:star-solid"
              class="text-primary"
            ></iconify-icon>

            <iconify-icon
              icon="clarity:star-solid"
              class="text-primary"
            ></iconify-icon>

            <iconify-icon
              icon="clarity:star-solid"
              class="text-primary"
            ></iconify-icon>

            <iconify-icon
              icon="clarity:star-solid"
              class="text-primary"
            ></iconify-icon>

            <iconify-icon
              icon="clarity:star-solid"
              class="text-primary"
            ></iconify-icon>

            {" "}5.0
          </span>

          <h3 className="secondary-font text-primary">
            129.000đ
          </h3>

          <div className="d-flex flex-wrap mt-3">

            <a
              href="#"
              className="btn-cart me-3 px-4 pt-3 pb-3"
            >
              <h5 className="text-uppercase m-0">
                Thêm vào giỏ
              </h5>
            </a>

            <a
              href="#"
              className="btn-wishlist px-4 pt-3"
            >
              <iconify-icon
                icon="fluent:heart-28-filled"
                class="fs-5"
              ></iconify-icon>
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductCard;
