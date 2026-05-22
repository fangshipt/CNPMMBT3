import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { message } from "antd";
import { getWishlistApi, toggleWishlistApi } from "../../util/api";
import { AuthContext } from "./authContext";

export const WishlistContext = createContext({
    wishlist: [],
    wishlistCount: 0,
    isInWishlist: () => false,
    toggleWishlist: async () => {},
    fetchWishlist: async () => {},
});

export const WishlistWrapper = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);

    const fetchWishlist = useCallback(async () => {
        if (!auth.isAuthenticated) { setWishlist([]); return; }
        const res = await getWishlistApi().catch(() => null);
        if (res?.EC === 0) setWishlist(res.data || []);
    }, [auth.isAuthenticated]);

    useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

    const isInWishlist = (productId) =>
        wishlist.some(item => (item._id || item) === productId || (item._id || item)?.toString() === productId?.toString());

    const toggleWishlist = async (productId) => {
        const res = await toggleWishlistApi(productId).catch(() => null);
        if (res?.EC === 0) {
            if (res.data.inWishlist) {
                message.success("Đã thêm vào danh sách yêu thích");
                setWishlist(prev => [...prev, { _id: productId }]);
            } else {
                message.info("Đã xóa khỏi danh sách yêu thích");
                setWishlist(prev => prev.filter(item => (item._id || item)?.toString() !== productId?.toString()));
            }
            fetchWishlist();
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistCount: wishlist.length,
            isInWishlist,
            toggleWishlist,
            fetchWishlist,
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
