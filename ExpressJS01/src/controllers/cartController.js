import * as cartService from '../services/cartService.js';

export const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCartService(req.user.id);
        return res.json({ EC: 0, EM: 'success', data: cart });
    } catch (e) {
        return res.status(500).json({ EC: -1, EM: e.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) return res.status(400).json({ EC: 1, EM: 'Thiếu productId' });
        const cart = await cartService.addToCartService(req.user.id, productId, quantity || 1);
        return res.json({ EC: 0, EM: 'Đã thêm vào giỏ hàng', data: cart });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (quantity === undefined) return res.status(400).json({ EC: 1, EM: 'Thiếu quantity' });
        const cart = await cartService.updateCartItemService(req.user.id, productId, quantity);
        return res.json({ EC: 0, EM: 'Đã cập nhật giỏ hàng', data: cart });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await cartService.removeCartItemService(req.user.id, productId);
        return res.json({ EC: 0, EM: 'Đã xóa sản phẩm khỏi giỏ hàng', data: cart });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        await cartService.clearCartService(req.user.id);
        return res.json({ EC: 0, EM: 'Đã xóa giỏ hàng' });
    } catch (e) {
        return res.status(500).json({ EC: -1, EM: e.message });
    }
};
