import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../components/context/wishlistContext";
import { AuthContext } from "../components/context/authContext";
import ProductCard from "../components/card/productCard";

function WishlistPage() {
    const { auth } = useContext(AuthContext);
    const { wishlist } = useContext(WishlistContext);

    if (!auth.isAuthenticated) {
        return (
            <div style={{ background: "#F9F3EC", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="text-center">
                    <iconify-icon icon="ph:heart" style={{ fontSize: "3rem", color: "#ccc" }}></iconify-icon>
                    <p className="mt-3 text-gray-500">Vui lòng <Link to="/login">đăng nhập</Link> để xem danh sách yêu thích.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: "#F9F3EC", minHeight: "100vh" }}>
            <div className="container py-5">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="font-normal m-0" style={{ color: "#3a2e28" }}>
                        <iconify-icon icon="ph:heart" class="mr-2" style={{ color: "#ef4444" }}></iconify-icon>
                        Sản phẩm yêu thích
                    </h2>
                    <span className="badge rounded-pill" style={{ background: "#ef4444", fontSize: "0.85rem" }}>{wishlist.length}</span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                        <iconify-icon icon="ph:heart-break" style={{ fontSize: "3.5rem", color: "#ddd" }}></iconify-icon>
                        <p className="mt-3 text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
                        <Link to="/products" className="btn btn-primary rounded-3">Khám phá sản phẩm</Link>
                    </div>
                ) : (
                    <div className="row g-3">
                        {wishlist.map(product => (
                            <div key={product._id} className="col-sm-6 col-lg-3">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WishlistPage;
