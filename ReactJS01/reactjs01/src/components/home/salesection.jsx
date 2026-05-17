function SaleSection() {
  return (
    <section id="sale-section" className="my-5 py-5" style={{ background: '#FFF8F0' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-5">
                <h4 className="card-title text-primary fw-bold mb-3">Summer Sale</h4>
                <p className="card-text text-muted mb-4">Get up to 50% off on selected items</p>
                <a href="#" className="btn btn-primary btn-sm">Shop Now</a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center p-5">
                <h4 className="card-title text-success fw-bold mb-3">New Arrivals</h4>
                <p className="card-text text-muted mb-4">Check out our latest collection</p>
                <a href="#" className="btn btn-success btn-sm">Explore</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SaleSection;
