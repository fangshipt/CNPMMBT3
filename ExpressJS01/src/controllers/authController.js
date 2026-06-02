
import {
    registerService,
    activateAccountService,
    loginService,
    forgotPasswordService,
    resetPasswordService,
    editProfileService,
} from '../services/authService.js';
import User from '../models/user.js';

// ─── POST /api/auth/register ─────────────────────────────────────────────────
export const register = async (req, res) => {
    try {
        const result = await registerService(req.body);
        const status = result.EC === 0 ? 201 : 400;
        return res.status(status).json(result);
    } catch (error) {
        console.error('[register]', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server, vui lòng thử lại sau.' });
    }
};

// ─── POST /api/auth/activate ─────────────────────────────────────────────────
export const activateAccount = async (req, res) => {
    try {
        const result = await activateAccountService(req.body);
        const status = result.EC === 0 ? 200 : 400;
        return res.status(status).json(result);
    } catch (error) {
        console.error('[activateAccount]', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const result = await loginService(req.body);
        const status = result.EC === 0 ? 200 : 400;
        return res.status(status).json(result);
    } catch (error) {
        console.error('[login]', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export const forgotPassword = async (req, res) => {
    try {
        const result = await forgotPasswordService(req.body);
        // Luôn trả 200 (không lộ email có tồn tại hay không)
        return res.status(200).json(result);
    } catch (error) {
        console.error('[forgotPassword]', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
export const resetPassword = async (req, res) => {
    try {
        const result = await resetPasswordService(req.body);
        const status = result.EC === 0 ? 200 : 400;
        return res.status(status).json(result);
    } catch (error) {
        console.error('[resetPassword]', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};

// ─── GET /api/auth/customer/profile ──────────────────────────────────────────
// Yêu cầu: đã đăng nhập + role = customer
export const getCustomerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -otp -otpExpiry -otpType');
        if (!user) return res.status(404).json({ EC: 1, EM: 'Không tìm thấy người dùng.' });
        return res.status(200).json({ EC: 0, EM: 'Lấy thông tin thành công.', data: user });
    } catch (error) {
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};

// ─── GET /api/auth/admin/profile ─────────────────────────────────────────────
// Yêu cầu: đã đăng nhập + role = admin
export const getAdminProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -otp -otpExpiry -otpType');
        if (!user) return res.status(404).json({ EC: 1, EM: 'Không tìm thấy người dùng.' });

        // Thống kê nhanh cho admin dashboard
        const totalUsers = await User.countDocuments({ role: 'customer' });

        return res.status(200).json({
            EC: 0,
            EM: 'Lấy thông tin admin thành công.',
            data: { user, stats: { totalUsers } },
        });
    } catch (error) {
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};

// ─── PUT /api/auth/edit-profile ───────────────────────────────────────────────
// Yêu cầu: đã đăng nhập (mọi role)
export const editProfile = async (req, res) => {
    try {
        const result = await editProfileService(req.user.id, req.body);
        const status = result.EC === 0 ? 200 : 400;
        return res.status(status).json(result);
    } catch (error) {
        console.error('[editProfile]', error);
        return res.status(500).json({ EC: -1, EM: 'Lỗi server.' });
    }
};
