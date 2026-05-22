import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const getCartService = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name images price discountPrice stock isActive');
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
};

export const addToCartService = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) throw new Error('Sản phẩm không tồn tại');
    if (product.stock < quantity) throw new Error('Số lượng vượt quá tồn kho');

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const image = product.images?.[0] || '';

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const existingIdx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (existingIdx >= 0) {
        const newQty = cart.items[existingIdx].quantity + quantity;
        if (newQty > product.stock) throw new Error('Số lượng vượt quá tồn kho');
        cart.items[existingIdx].quantity = newQty;
    } else {
        cart.items.push({ product: productId, quantity, price, name: product.name, image });
    }

    await cart.save();
    return cart.populate('items.product', 'name images price discountPrice stock isActive');
};

export const updateCartItemService = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Giỏ hàng không tồn tại');

    if (quantity <= 0) {
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
        const product = await Product.findById(productId);
        if (!product) throw new Error('Sản phẩm không tồn tại');
        if (quantity > product.stock) throw new Error('Số lượng vượt quá tồn kho');

        const idx = cart.items.findIndex((i) => i.product.toString() === productId);
        if (idx < 0) throw new Error('Sản phẩm không có trong giỏ hàng');
        cart.items[idx].quantity = quantity;
    }

    await cart.save();
    return cart.populate('items.product', 'name images price discountPrice stock isActive');
};

export const removeCartItemService = async (userId, productId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error('Giỏ hàng không tồn tại');
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    return cart.populate('items.product', 'name images price discountPrice stock isActive');
};

export const clearCartService = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return;
    cart.items = [];
    await cart.save();
};
