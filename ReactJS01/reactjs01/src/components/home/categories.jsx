function Categories() {
  return (
    <section id="categories">
      <div className="container my-3 py-5">
        <div className="row my-5">

          <div className="col text-center">
            <a href="#" className="categories-item">
              <iconify-icon
                class="category-icon"
                icon="ph:bowl-food"
              ></iconify-icon>

              <h5>Foodies</h5>
            </a>
          </div>

          <div className="col text-center">
            <a href="#" className="categories-item">
              <iconify-icon
                class="category-icon"
                icon="ph:bird"
              ></iconify-icon>

              <h5>Bird Shop</h5>
            </a>
          </div>

          <div className="col text-center">
            <a href="#" className="categories-item">
              <iconify-icon
                class="category-icon"
                icon="ph:dog"
              ></iconify-icon>

              <h5>Dog Shop</h5>
            </a>
          </div>

          <div className="col text-center">
            <a href="#" className="categories-item">
              <iconify-icon
                class="category-icon"
                icon="ph:fish"
              ></iconify-icon>

              <h5>Fish Shop</h5>
            </a>
          </div>

          <div className="col text-center">
            <a href="#" className="categories-item">
              <iconify-icon
                class="category-icon"
                icon="ph:cat"
              ></iconify-icon>

              <h5>Cat Shop</h5>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Categories;