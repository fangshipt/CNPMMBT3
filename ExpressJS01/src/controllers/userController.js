import {
    createUserService,
    loginService,
    getUserService
} from '../services/userService.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

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

export const updateProfile = async (req, res) => {
    try {
        const { fullName, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { fullName: fullName?.trim(), phone: phone?.trim() || '' },
            { new: true, select: '-password' }
        );
        return res.json({ EC: 0, EM: 'Cập nhật thông tin thành công', data: user });
    } catch (error) {
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ EC: 1, EM: 'Vui lòng nhập đầy đủ thông tin' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ EC: 1, EM: 'Mật khẩu mới tối thiểu 6 ký tự' });
        }
        const user = await User.findById(req.user._id);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ EC: 1, EM: 'Mật khẩu hiện tại không đúng' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.json({ EC: 0, EM: 'Đổi mật khẩu thành công' });
    } catch (error) {
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};

export const updateAvatar = async (req, res) => {
    try {
        const { avatar } = req.body;
        if (!avatar) return res.status(400).json({ EC: 1, EM: 'Vui lòng cung cấp URL ảnh' });
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar },
            { new: true, select: '-password' }
        );
        return res.json({ EC: 0, EM: 'Cập nhật ảnh đại diện thành công', data: user });
    } catch (error) {
        return res.status(500).json({ EC: 1, EM: error.message });
    }
};