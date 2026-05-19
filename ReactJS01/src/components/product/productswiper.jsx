import { useState } from "react";
import { getImageUrl } from "../../util/api";

function ProductSwiper({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div
        className="bg-light rounded-4 d-flex align-items-center justify-content-center"
        style={{ aspectRatio: "1", width: "100%" }}
      >
        <iconify-icon icon="ph:image" style={{ fontSize: "4rem", color: "#ccc" }}></iconify-icon>
      </div>
    );
  }

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <div>
      {/* Main image */}
      <div className="position-relative mb-3" style={{ overflow: "hidden", borderRadius: "1rem" }}>
        <img
          src={getImageUrl(images[activeIndex])}
          alt={`Ảnh ${activeIndex + 1}`}
          className="img-fluid w-100"
          style={{ aspectRatio: "1", objectFit: "cover", transition: "opacity 0.2s" }}
        />

        {images.length > 1 && (
          <>
            <button
              className="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow-sm"
              style={{ width: "36px", height: "36px", padding: 0 }}
              onClick={prev}
              type="button"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button
              className="btn btn-light position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow-sm"
              style={{ width: "36px", height: "36px", padding: 0 }}
              onClick={next}
              type="button"
              aria-label="Ảnh sau"
            >
              ›
            </button>

            {/* Dots */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className="border-0 rounded-circle p-0"
                  style={{
                    width: "8px",
                    height: "8px",
                    background: i === activeIndex ? "#333" : "#ccc",
                    cursor: "pointer",
                  }}
                  aria-label={`Ảnh ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="d-flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="border-0 p-0 rounded-3 overflow-hidden"
              style={{
                width: "64px",
                height: "64px",
                outline: i === activeIndex ? "2px solid var(--bs-primary, #0d6efd)" : "2px solid transparent",
                cursor: "pointer",
              }}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductSwiper;
