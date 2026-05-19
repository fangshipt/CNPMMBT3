function QuantityButton({ quantity, onChange, min = 1, max = 999 }) {
  const decrement = () => {
    if (quantity > min) onChange(quantity - 1);
  };

  const increment = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  const handleInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) onChange(val);
  };

  return (
    <div className="d-flex align-items-center border rounded-2 overflow-hidden" style={{ width: "fit-content" }}>
      <button
        className="btn btn-light border-0 px-3 py-2"
        onClick={decrement}
        disabled={quantity <= min}
        type="button"
        style={{ fontSize: "1.2rem", lineHeight: 1 }}
      >
        −
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInput}
        min={min}
        max={max}
        className="form-control border-0 text-center p-0"
        style={{ width: "48px", boxShadow: "none" }}
      />

      <button
        className="btn btn-light border-0 px-3 py-2"
        onClick={increment}
        disabled={quantity >= max}
        type="button"
        style={{ fontSize: "1.2rem", lineHeight: 1 }}
      >
        +
      </button>
    </div>
  );
}

export default QuantityButton;
