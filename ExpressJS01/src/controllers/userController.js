import {
    createUserService,
    loginService,
    getUserService
} from '../services/userService.js';
import User from '../models/user.js';

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await createUserService(name, email, password);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server' });
    }
}

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await loginService(email, password);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server' });
    }
}

export const getUser = async (req, res) => {

    const data = await getUserService();

    return res.status(200).json(data);
}

export const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist', 'name images price discountPrice rating sold slug');
        return res.json({ EC: 0, data: user.wishlist || [] });
    } catch (error) {
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;
        const idx = user.wishlist.findIndex(id => id.toString() === productId);
        if (idx === -1) {
            user.wishlist.push(productId);
        } else {
            user.wishlist.splice(idx, 1);
        }
        await user.save();
        return res.json({ EC: 0, data: { inWishlist: idx === -1, wishlist: user.wishlist } });
    } catch (error) {
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};