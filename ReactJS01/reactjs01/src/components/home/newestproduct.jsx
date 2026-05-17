function NewestProduct() {
  const products = [
    { id: 1, name: 'Pet Collar', price: '$19.99', image: '🐕' },
    { id: 2, name: 'Pet Toy', price: '$14.99', image: '🎾' },
    { id: 3, name: 'Pet Bowl', price: '$9.99', image: '🍖' },
    { id: 4, name: 'Pet Bed', price: '$49.99', image: '🛏️' },
  ];

  return (
    <section id="newest-products" className="my-5 py-5">
      <div className="container">
        <h2 className="mb-5 text-center">Newest Products</h2>
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-4">
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                    {product.image}
                  </div>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-primary fw-bold">{product.price}</p>
                  <button className="btn btn-outline-primary btn-sm">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewestProduct;
