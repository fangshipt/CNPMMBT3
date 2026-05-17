function BestSelling() {
  const bestSellers = [
    { id: 1, name: 'Premium Dog Food', price: '$24.99', rating: '⭐⭐⭐⭐⭐' },
    { id: 2, name: 'Cat Grooming Kit', price: '$34.99', rating: '⭐⭐⭐⭐⭐' },
    { id: 3, name: 'Pet Treat Pack', price: '$12.99', rating: '⭐⭐⭐⭐' },
    { id: 4, name: 'Interactive Toy Set', price: '$29.99', rating: '⭐⭐⭐⭐⭐' },
  ];

  return (
    <section id="bestselling" className="my-5 py-5" style={{ background: '#F9F9F9' }}>
      <div className="container">
        <h2 className="mb-5 text-center">Best Selling Products</h2>
        <div className="row g-4">
          {bestSellers.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text mb-2">
                    <small className="text-warning">{item.rating}</small>
                  </p>
                  <p className="card-text text-primary fw-bold fs-5">{item.price}</p>
                  <button className="btn btn-primary btn-sm w-100">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BestSelling;
