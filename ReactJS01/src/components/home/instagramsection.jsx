import insta1 from "../../assets/insta1.jpg";
import insta2 from "../../assets/insta2.jpg";
import insta3 from "../../assets/insta3.jpg";
import insta4 from "../../assets/insta4.jpg";
import insta5 from "../../assets/insta5.jpg";
import insta6 from "../../assets/insta6.jpg";

const instagramImages = [insta1, insta2, insta3, insta4, insta5, insta6];

function InstagramSection() {
  return (
    <section id="insta" className="my-5">
      <div className="row g-0 py-5">
        {instagramImages.map((image, index) => (
          <div
            className="col-6 col-md-4 col-xl instagram-item text-center position-relative"
            key={image}
          >
            <div className="icon-overlay d-flex justify-content-center position-absolute">
              <iconify-icon
                class="text-white"
                icon="la:instagram"
              ></iconify-icon>
            </div>

            <a href="#">
              <img
                src={image}
                alt={`Khoảnh khắc thú cưng ${index + 1}`}
                className="img-fluid rounded-3"
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default InstagramSection;
