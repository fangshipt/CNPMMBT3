/**
 * ╔══════════════════════════════════════════════════════╗
 *  TẦNG ROUTE — Định nghĩa endpoint + gắn middleware
 *  Mô hình 3 tầng: Route → Controller → Service → Model
 * ╚══════════════════════════════════════════════════════╝
 *
 *  Base path: /api/auth
 *
 *  Public  (không cần token):
 *    POST /register           — Đăng ký + gửi OTP email
 *    POST /activate           — Kích hoạt tài khoản bằng OTP
 *    POST /login              — Đăng nhập → JWT + redirectUrl
 *    POST /forgot-password    — Yêu cầu OTP đặt lại mật khẩu
 *    POST /reset-password     — Đặt lại mật khẩu bằng OTP
 *
 *  Protected (cần Bearer Token):
 *    GET  /customer/profile   — Xem profile (role: customer)
 *    GET  /admin/profile      — Xem profile + stats (role: admin)
 *    PUT  /edit-profile       — Chỉnh sửa thông tin cá nhân
 */

import express from 'express';
import { authLimiter, otpLimiter } from '../middleware/rateLimiter.js';
import auth, { isAdmin } from '../middleware/auth.js';
import {
    register,
    activateAccount,
    login,
    forgotPassword,
    resetPassword,
    getCustomerProfile,
    getAdminProfile,
    editProfile,
} from '../controllers/authController.js';

const router = express.Router();

// ─── Middleware kiểm tra role customer ──────────────────────────────────────
const isCustomer = (req, res, next) => {
    if (req.user?.role !== 'customer') {
        return res.status(403).json({
            EC: 1,
            EM: 'Chỉ tài khoản khách hàng mới được truy cập.',
        });
    }
    next();
};

// ════════════════════════════════════════════════════════════════════════════
//  PUBLIC ROUTES
// ════════════════════════════════════════════════════════════════════════════

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký tài khoản mới — có validation + rate limiting
 * @access  Public
 * @body    { fullName, email, password, confirmPassword }
 */
router.post('/register', authLimiter, register);

/**
 * @route   POST /api/auth/activate
 * @desc    Kích hoạt tài khoản bằng OTP gửi qua email
 * @access  Public
 * @body    { email, otp }
 */
router.post('/activate', otpLimiter, activateAccount);

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập — trả về JWT + redirectUrl theo role
 * @access  Public
 * @body    { email, password }
 * @returns { EC, access_token, redirectUrl, user }
 *            redirectUrl = '/customer/profile' | '/admin/profile'
 */
router.post('/login', authLimiter, login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Gửi OTP đặt lại mật khẩu về email
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password', otpLimiter, forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Đặt lại mật khẩu sau khi xác minh OTP
 * @access  Public
 * @body    { email, otp, newPassword, confirmPassword }
 */
router.post('/reset-password', otpLimiter, resetPassword);

// ════════════════════════════════════════════════════════════════════════════
//  PROTECTED ROUTES — yêu cầu Bearer Token
// ════════════════════════════════════════════════════════════════════════════

/**
 * @route   GET /api/auth/customer/profile
 * @desc    Xem thông tin cá nhân (chỉ dành cho customer)
 * @access  Private [role: customer]
 * @header  Authorization: Bearer <token>
 */
router.get('/customer/profile', auth, isCustomer, getCustomerProfile);

/**
 * @route   GET /api/auth/admin/profile
 * @desc    Xem thông tin admin + thống kê nhanh
 * @access  Private [role: admin]
 * @header  Authorization: Bearer <token>
 */
router.get('/admin/profile', auth, isAdmin, getAdminProfile);

/**
 * @route   PUT /api/auth/edit-profile
 * @desc    Chỉnh sửa thông tin cá nhân (fullName, phone, avatar)
 * @access  Private [mọi role]
 * @header  Authorization: Bearer <token>
 * @body    { fullName?, phone?, avatar? }
 */
router.put('/edit-profile', auth, editProfile);

export default router;
