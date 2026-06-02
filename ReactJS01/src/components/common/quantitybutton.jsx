function QuantityButton({ quantity, onChange, min = 1, max = 999 }) {
  const decrement = () => { if (quantity > min) onChange(quantity - 1); };
  const increment = () => { if (quantity < max) onChange(quantity + 1); };
  const handleInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= min && val <= max) onChange(val);
  };

  const btnStyle = (disabled) => ({
    width: 32,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: disabled ? "#f5f0eb" : "#fff",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    color: disabled ? "#c8b8ac" : "#5a4a3f",
    fontSize: "1.1rem",
    fontWeight: 400,
    flexShrink: 0,
    transition: "background 0.15s",
  });

  return (
    <div style={{ display: "inline-flex", alignItems: "center", border: "1.5px solid #e0d5ca", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <button type="button" onClick={decrement} disabled={quantity <= min} style={btnStyle(quantity <= min)}>
        −
      </button>
      <div style={{ width: 1, height: 20, background: "#e0d5ca", flexShrink: 0 }} />
      <input
        type="number"
        value={quantity}
        onChange={handleInput}
        min={min}
        max={max}
        style={{ width: 44, height: 36, border: "none", outline: "none", textAlign: "center", fontSize: "0.9rem", fontWeight: 500, color: "#3a2e28", background: "transparent", boxShadow: "none", padding: 0 }}
      />
      <div style={{ width: 1, height: 20, background: "#e0d5ca", flexShrink: 0 }} />
      <button type="button" onClick={increment} disabled={quantity >= max} style={btnStyle(quantity >= max)}>
        +
      </button>
    </div>
  );
}

export default QuantityButton;
