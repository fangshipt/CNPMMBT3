import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { getCartApi, addToCartApi, updateCartItemApi, removeCartItemApi, clearCartApi } from '../../util/api';
import { AuthContext } from './authContext';

export const CartContext = createContext({
    cart: null,
    cartCount: 0,
    cartTotal: 0,
    loading: false,
    fetchCart: () => {},
    addToCart: async () => {},
    updateItem: async () => {},
    removeItem: async () => {},
    clearCart: async () => {},
});

export const CartWrapper = ({ children }) => {
    const { auth } = useContext(AuthContext);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!auth.isAuthenticated) { setCart(null); return; }
        setLoading(true);
        const res = await getCartApi();
        if (res?.EC === 0) setCart(res.data);
        setLoading(false);
    }, [auth.isAuthenticated]);

    useEffect(() => { fetchCart(); }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        const res = await addToCartApi(productId, quantity);
        if (res?.EC === 0) setCart(res.data);
        return res;
    };

    const updateItem = async (productId, quantity) => {
        const res = await updateCartItemApi(productId, quantity);
        if (res?.EC === 0) setCart(res.data);
        return res;
    };

    const removeItem = async (productId) => {
        const res = await removeCartItemApi(productId);
        if (res?.EC === 0) setCart(res.data);
        return res;
    };

    const clearCart = async () => {
        const res = await clearCartApi();
        if (res?.EC === 0) setCart(null);
        return res;
    };

    const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
    const cartTotal = cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, cartTotal, loading, fetchCart, addToCart, updateItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
