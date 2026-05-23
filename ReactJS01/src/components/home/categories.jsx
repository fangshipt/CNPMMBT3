import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi, getImageUrl } from "../../util/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoriesApi({ limit: 20 }).then((res) => {
      if (res.EC === 0) setCategories(res.data);
    });
  }, []);

  return (
    <section id="categories" style={{ background: "#fff" }}>
      <div className="container py-5">
        <div className="categories-row">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="categories-item text-decoration-none d-flex flex-column align-items-center"
            >
              <div className="category-img-wrapper">
                {cat.image && (
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="category-img"
                  />
                )}
              </div>
              <span className="category-label">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
