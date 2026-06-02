/**
 * ╔══════════════════════════════════════════════════════╗
 *  TẦNG SERVICE — Xử lý nghiệp vụ xác thực
 *  Mô hình 3 tầng: Route → Controller → Service → Model
 * ╚══════════════════════════════════════════════════════╝
 *
 * Các chức năng:
 *  1. register          — đăng ký + gửi OTP kích hoạt qua mail
 *  2. activateAccount   — xác minh OTP kích hoạt tài khoản
 *  3. login             — đăng nhập JWT + phân quyền (customer / admin)
 *  4. forgotPassword    — gửi OTP đặt lại mật khẩu qua mail
 *  5. resetPassword     — xác minh OTP + đổi mật khẩu mới
 *  6. editProfile       — cập nhật thông tin cá nhân
 */

import bcrypt from 'bcrypt';
import jwt    from 'jsonwebtoken';
import User   from '../models/user.js';
import sendEmail, {
    buildActivationEmail,
    buildResetPasswordEmail,
} from '../utils/sendEmail.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE  || '1d';

// ─── Helper: tạo JWT ─────────────────────────────────────────────────────────
const createToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
    );

// ─── Helper: tạo OTP 6 chữ số ────────────────────────────────────────────────
const generateOtp = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

// ─── Helper: validate email format ───────────────────────────────────────────
const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ─── Helper: validate password (≥6 ký tự, chứa chữ + số) ────────────────────
const isStrongPassword = (password) =>
    password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password);

// ─── Helper: validate số điện thoại Việt Nam ────────────────────────────────
const isValidPhone = (phone) =>
    /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(phone);

// ════════════════════════════════════════════════════════════════════════════
// 1. ĐĂNG KÝ TÀI KHOẢN
//    - Validation đầu vào
//    - Kiểm tra email đã tồn tại
//    - Hash mật khẩu
//    - Tạo user với isActive = false
//    - Sinh OTP 6 số, hết hạn sau 10 phút
//    - Gửi email kích hoạt
// ════════════════════════════════════════════════════════════════════════════
export const registerService = async ({ fullName, email, password, confirmPassword }) => {

    // ── Bước 1: Validation ────────────────────────────────────────────────
    if (!fullName || !email || !password || !confirmPassword) {
        return { EC: 1, EM: 'Vui lòng nhập đầy đủ thông tin (họ tên, email, mật khẩu).' };
    }

    if (fullName.trim().length < 2) {
        return { EC: 1, EM: 'Họ tên phải có ít nhất 2 ký tự.' };
    }

    if (!isValidEmail(email)) {
        return { EC: 1, EM: 'Địa chỉ email không hợp lệ.' };
    }

    if (!isStrongPassword(password)) {
        return { EC: 1, EM: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và chữ số.' };
    }

    if (password !== confirmPassword) {
        return { EC: 1, EM: 'Xác nhận mật khẩu không khớp.' };
    }

    // ── Bước 2: Kiểm tra email đã tồn tại ───────────────────────────────
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
        // Nếu đã có nhưng chưa kích hoạt → gợi ý kích hoạt lại
        if (!existing.isActive) {
            return {
                EC: 2,
                EM: 'Email đã được đăng ký nhưng chưa kích hoạt. Vui lòng kiểm tra hộp thư hoặc yêu cầu gửi lại OTP.',
            };
        }
        return { EC: 1, EM: 'Email đã được sử dụng. Vui lòng dùng email khác.' };
    }

    // ── Bước 3: Hash mật khẩu ────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Bước 4: Tạo OTP kích hoạt ────────────────────────────────────────
    const otp       = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // ── Bước 5: Lưu user (isActive = false) ──────────────────────────────
    const user = await User.create({
        fullName: fullName.trim(),
        email:    email.toLowerCase(),
        password: hashedPassword,
        role:     'customer',
        isActive: false,
        otp,
        otpExpiry,
        otpType: 'activate',
    });

    // ── Bước 6: Gửi email kích hoạt ──────────────────────────────────────
    const emailContent = buildActivationEmail(user.fullName, otp);
    await sendEmail({ to: user.email, ...emailContent });

    return {
        EC: 0,
        EM: 'Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP kích hoạt tài khoản (hiệu lực 10 phút).',
        data: { email: user.email, fullName: user.fullName },
    };
};

// ════════════════════════════════════════════════════════════════════════════
// 2. KÍCH HOẠT TÀI KHOẢN QUA OTP
//    - Tìm user theo email
//    - Kiểm tra OTP đúng & còn hiệu lực
//    - Đặt isActive = true, xóa OTP
// ════════════════════════════════════════════════════════════════════════════
export const activateAccountService = async ({ email, otp }) => {

    if (!email || !otp) {
        return { EC: 1, EM: 'Vui lòng cung cấp email và mã OTP.' };
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return { EC: 1, EM: 'Email không tồn tại trong hệ thống.' };
    }

    if (user.isActive) {
        return { EC: 2, EM: 'Tài khoản đã được kích hoạt trước đó.' };
    }

    if (user.otpType !== 'activate' || user.otp !== otp) {
        return { EC: 1, EM: 'Mã OTP không hợp lệ.' };
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
        return { EC: 1, EM: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' };
    }

    // Kích hoạt tài khoản + xóa OTP
    user.isActive  = true;
    user.otp       = null;
    user.otpExpiry = null;
    user.otpType   = null;
    await user.save();

    return { EC: 0, EM: 'Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay.' };
};

// ════════════════════════════════════════════════════════════════════════════
// 3. ĐĂNG NHẬP + PHÂN QUYỀN (JWT)
//    - Validation
//    - Kiểm tra tài khoản tồn tại & đã kích hoạt
//    - So sánh mật khẩu
//    - Tạo JWT
//    - Trả về redirectUrl theo role:
//        customer → /customer/profile
//        admin    → /admin/profile
// ════════════════════════════════════════════════════════════════════════════
export const loginService = async ({ email, password }) => {

    // ── Validation ────────────────────────────────────────────────────────
    if (!email || !password) {
        return { EC: 1, EM: 'Vui lòng nhập email và mật khẩu.' };
    }

    if (!isValidEmail(email)) {
        return { EC: 1, EM: 'Địa chỉ email không hợp lệ.' };
    }

    // ── Tìm user ──────────────────────────────────────────────────────────
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return { EC: 1, EM: 'Email hoặc mật khẩu không đúng.' };
    }

    // ── Kiểm tra trạng thái kích hoạt ────────────────────────────────────
    if (user.isActive === false) {
        return {
            EC: 3,
            EM: 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email và nhập mã OTP.',
        };
    }

    // ── Kiểm tra khoá tài khoản ───────────────────────────────────────────
    if (user.lockUntil && user.lockUntil > new Date()) {
        const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return {
            EC: 4,
            EM: `Tài khoản bị khoá do đăng nhập sai nhiều lần. Vui lòng thử lại sau ${remaining} phút.`,
        };
    }

    // ── So sánh mật khẩu ─────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const MAX_ATTEMPTS = 5;
        const LOCK_MINUTES = 15;
        user.loginAttempts = (user.loginAttempts || 0) + 1;

        if (user.loginAttempts >= MAX_ATTEMPTS) {
            user.lockUntil     = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
            user.loginAttempts = 0;
            await user.save();
            return {
                EC: 4,
                EM: `Sai mật khẩu quá ${MAX_ATTEMPTS} lần. Tài khoản bị khoá ${LOCK_MINUTES} phút.`,
            };
        }

        await user.save();
        const left = MAX_ATTEMPTS - user.loginAttempts;
        return {
            EC: 1,
            EM: `Email hoặc mật khẩu không đúng. Còn ${left} lần thử trước khi bị khoá.`,
        };
    }

    // ── Đăng nhập thành công: reset đếm sai ──────────────────────────────
    if (user.loginAttempts > 0 || user.lockUntil) {
        user.loginAttempts = 0;
        user.lockUntil     = null;
        await user.save();
    }

    // ── Tạo JWT ───────────────────────────────────────────────────────────
    const access_token = createToken(user);

    // ── Phân quyền: xác định redirectUrl ─────────────────────────────────
    const redirectUrl = user.role === 'admin' ? '/admin/profile' : '/customer/profile';

    return {
        EC: 0,
        EM: 'Đăng nhập thành công.',
        access_token,
        redirectUrl,
        user: {
            id:       user._id,
            fullName: user.fullName,
            email:    user.email,
            role:     user.role,
            avatar:   user.avatar,
        },
    };
};

// ════════════════════════════════════════════════════════════════════════════
// 4. QUÊN MẬT KHẨU — Gửi OTP qua email
//    - Tìm user (không tiết lộ email không tồn tại)
//    - Sinh OTP, lưu với type = 'forgot_password'
//    - Gửi email
// ════════════════════════════════════════════════════════════════════════════
export const forgotPasswordService = async ({ email }) => {

    if (!email || !isValidEmail(email)) {
        return { EC: 1, EM: 'Vui lòng nhập địa chỉ email hợp lệ.' };
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Không tiết lộ email có tồn tại hay không (bảo mật)
    if (!user || user.isActive === false) {
        return {
            EC: 0,
            EM: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi mã OTP. Vui lòng kiểm tra hộp thư.',
        };
    }

    // Sinh OTP + thời gian hết hạn 10 phút
    const otp       = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp       = otp;
    user.otpExpiry = otpExpiry;
    user.otpType   = 'forgot_password';
    await user.save();

    // Gửi email
    const emailContent = buildResetPasswordEmail(user.fullName, otp);
    await sendEmail({ to: user.email, ...emailContent });

    return {
        EC: 0,
        EM: 'Mã OTP đặt lại mật khẩu đã được gửi về email. Vui lòng kiểm tra hộp thư (hiệu lực 10 phút).',
    };
};

// ════════════════════════════════════════════════════════════════════════════
// 5. ĐẶT LẠI MẬT KHẨU QUA OTP
//    - Xác minh OTP (type + giá trị + thời hạn)
//    - Hash mật khẩu mới
//    - Cập nhật + xóa OTP
// ════════════════════════════════════════════════════════════════════════════
export const resetPasswordService = async ({ email, otp, newPassword, confirmPassword }) => {

    if (!email || !otp || !newPassword || !confirmPassword) {
        return { EC: 1, EM: 'Vui lòng nhập đầy đủ email, OTP và mật khẩu mới.' };
    }

    if (!isStrongPassword(newPassword)) {
        return { EC: 1, EM: 'Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ cái và chữ số.' };
    }

    if (newPassword !== confirmPassword) {
        return { EC: 1, EM: 'Xác nhận mật khẩu không khớp.' };
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return { EC: 1, EM: 'Email không tồn tại trong hệ thống.' };
    }

    if (user.otpType !== 'forgot_password' || user.otp !== otp) {
        return { EC: 1, EM: 'Mã OTP không hợp lệ.' };
    }

    if (!user.otpExpiry || new Date() > user.otpExpiry) {
        return { EC: 1, EM: 'Mã OTP đã hết hạn. Vui lòng gửi lại yêu cầu quên mật khẩu.' };
    }

    // Cập nhật mật khẩu + xóa OTP
    user.password  = await bcrypt.hash(newPassword, 10);
    user.otp       = null;
    user.otpExpiry = null;
    user.otpType   = null;
    await user.save();

    return { EC: 0, EM: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.' };
};

// ════════════════════════════════════════════════════════════════════════════
// 6. CHỈNH SỬA THÔNG TIN CÁ NHÂN
//    - Chỉ cập nhật các trường được cung cấp
//    - Validation: fullName, phone
//    - Không cho phép đổi email / role / mật khẩu qua endpoint này
// ════════════════════════════════════════════════════════════════════════════
export const editProfileService = async (userId, { fullName, phone, avatar }) => {

    const updates = {};

    if (fullName !== undefined) {
        if (fullName.trim().length < 2) {
            return { EC: 1, EM: 'Họ tên phải có ít nhất 2 ký tự.' };
        }
        updates.fullName = fullName.trim();
    }

    if (phone !== undefined) {
        if (phone !== '' && !isValidPhone(phone)) {
            return { EC: 1, EM: 'Số điện thoại không đúng định dạng Việt Nam (VD: 0912345678).' };
        }
        updates.phone = phone.trim();
    }

    if (avatar !== undefined) {
        if (avatar !== '' && !/^https?:\/\/.+/.test(avatar)) {
            return { EC: 1, EM: 'URL ảnh đại diện không hợp lệ.' };
        }
        updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
        return { EC: 1, EM: 'Không có thông tin nào được cung cấp để cập nhật.' };
    }

    const updated = await User.findByIdAndUpdate(
        userId,
        updates,
        { new: true, select: '-password -otp -otpExpiry -otpType' }
    );

    if (!updated) {
        return { EC: 1, EM: 'Không tìm thấy người dùng.' };
    }

    return { EC: 0, EM: 'Cập nhật thông tin thành công.', data: updated };
};
