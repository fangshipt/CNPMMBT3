/**
 * Rate Limiting Middleware — express-rate-limit
 *
 * authLimiter  : dùng cho /login, /register  → tối đa 10 req / 15 phút / IP
 * otpLimiter   : dùng cho /activate, /forgot-password, /reset-password
 *                → tối đa 5 req / 15 phút / IP (chặt hơn để chống brute-force OTP)
 */

import rateLimit from 'express-rate-limit';

// ─── Giới hạn cho login & register ──────────────────────────────────────────
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 phút
    max: 10,                    // tối đa 10 request
    standardHeaders: true,      // gửi header RateLimit-*
    legacyHeaders: false,
    message: {
        EC: -1,
        EM: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút.',
    },
});

// ─── Giới hạn chặt hơn cho các thao tác OTP ─────────────────────────────────
export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 phút
    max: 20,                    // tối đa 20 request
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        EC: -1,
        EM: 'Quá nhiều yêu cầu OTP, vui lòng thử lại sau 15 phút.',
    },
});
