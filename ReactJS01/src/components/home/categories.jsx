import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategoriesApi } from "../../util/api";

const CATEGORY_ICONS = {
  "thuc-an": "ph:bowl-food",
  "cho-chim": "ph:bird",
  "cho-cho": "ph:dog",
  "cho-ca": "ph:fish",
  "cho-meo": "ph:cat",
};

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoriesApi({ limit: 20 }).then((res) => {
      if (res.EC === 0) setCategories(res.data);
    });
  }, []);

  return (
    <section id="categories">
      <div className="container my-3 py-5">
        <div className="row my-5">
          {categories.map((cat) => (
            <div key={cat._id} className="col text-center">
              <Link to={`/products?category=${cat._id}`} className="categories-item text-decoration-none">
                <iconify-icon
                  class="category-icon"
                  icon={CATEGORY_ICONS[cat.slug] || "ph:paw-print"}
                ></iconify-icon>
                <h5>{cat.name}</h5>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
