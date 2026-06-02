import { useState } from "react";
import { getImageUrl } from "../../util/api";

function ProductSwiper({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div
        className="bg-gray-100 rounded-2xl flex items-center justify-center w-full"
        style={{ aspectRatio: "1" }}
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
      <div className="relative mb-3 overflow-hidden rounded-2xl">
        <img
          src={getImageUrl(images[activeIndex])}
          alt={`Ảnh ${activeIndex + 1}`}
          className="img-fluid w-full"
          style={{ aspectRatio: "1", objectFit: "cover", transition: "opacity 0.2s" }}
        />

        {images.length > 1 && (
          <>
            <button
              className="btn btn-light absolute top-1/2 left-0 -translate-y-1/2 ml-2 rounded-full shadow-sm"
              style={{ width: "36px", height: "36px", padding: 0 }}
              onClick={prev}
              type="button"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button
              className="btn btn-light absolute top-1/2 right-0 -translate-y-1/2 mr-2 rounded-full shadow-sm"
              style={{ width: "36px", height: "36px", padding: 0 }}
              onClick={next}
              type="button"
              aria-label="Ảnh sau"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2 flex gap-1">
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
        <div className="flex gap-2 flex-wrap">
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

