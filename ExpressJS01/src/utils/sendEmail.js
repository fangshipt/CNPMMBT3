/**
 * Tiện ích gửi email qua Nodemailer (SMTP Gmail)
 * Cấu hình từ biến môi trường: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
 */

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Tạo transporter một lần, tái sử dụng cho mọi request
const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST  || 'smtp.gmail.com',
    port:   Number(process.env.EMAIL_PORT) || 587,
    secure: false,   // TLS (STARTTLS) — port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Gửi email
 * @param {object} options
 * @param {string} options.to      - Địa chỉ người nhận
 * @param {string} options.subject - Tiêu đề
 * @param {string} options.html    - Nội dung HTML
 */
const sendEmail = async ({ to, subject, html }) => {
    const info = await transporter.sendMail({
        from: `"FangShi Pet Shop 🐾" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
    console.log(`📧 Email gửi đến ${to} — MessageId: ${info.messageId}`);
    return info;
};

// ─── Template: kích hoạt tài khoản ──────────────────────────────────────────

export const buildActivationEmail = (fullName, otp) => ({
    subject: '🐾 Kích hoạt tài khoản FangShi Pet Shop',
    html: `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#FFF8F0;border-radius:16px;overflow:hidden;border:1px solid #f0e8df">
      <div style="background:linear-gradient(135deg,#3D2B1F,#5a4a3f);padding:28px 32px;text-align:center">
        <h2 style="color:#fff;margin:0;font-size:1.5rem">🐾 FangShi Pet Shop</h2>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:0.9rem">Chào mừng bạn đến với cửa hàng!</p>
      </div>
      <div style="padding:32px">
        <p style="color:#3a2e28;font-size:1rem">Xin chào <strong>${fullName}</strong>,</p>
        <p style="color:#5a4a3f">Cảm ơn bạn đã đăng ký tài khoản. Vui lòng nhập mã OTP bên dưới để kích hoạt tài khoản:</p>
        <div style="background:#fff;border:2px dashed #ff6b35;border-radius:12px;padding:20px;text-align:center;margin:24px 0">
          <p style="color:#8a7060;font-size:0.85rem;margin:0 0 8px">Mã kích hoạt của bạn</p>
          <span style="font-size:2.2rem;font-weight:800;color:#ff6b35;letter-spacing:8px">${otp}</span>
          <p style="color:#aaa;font-size:0.8rem;margin:10px 0 0">⏱ Mã có hiệu lực trong <strong>10 phút</strong></p>
        </div>
        <p style="color:#8a7060;font-size:0.85rem">Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.</p>
      </div>
      <div style="background:#f5ede7;padding:16px 32px;text-align:center">
        <p style="color:#aaa;font-size:0.8rem;margin:0">© 2024 FangShi Pet Shop</p>
      </div>
    </div>`,
});

// ─── Template: quên mật khẩu ────────────────────────────────────────────────

export const buildResetPasswordEmail = (fullName, otp) => ({
    subject: '🔐 Đặt lại mật khẩu FangShi Pet Shop',
    html: `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#FFF8F0;border-radius:16px;overflow:hidden;border:1px solid #f0e8df">
      <div style="background:linear-gradient(135deg,#3D2B1F,#5a4a3f);padding:28px 32px;text-align:center">
        <h2 style="color:#fff;margin:0;font-size:1.5rem">🔐 Đặt lại mật khẩu</h2>
        <p style="color:rgba(255,255,255,0.7);margin:6px 0 0;font-size:0.9rem">FangShi Pet Shop</p>
      </div>
      <div style="padding:32px">
        <p style="color:#3a2e28;font-size:1rem">Xin chào <strong>${fullName}</strong>,</p>
        <p style="color:#5a4a3f">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhập mã OTP bên dưới:</p>
        <div style="background:#fff;border:2px dashed #e74c3c;border-radius:12px;padding:20px;text-align:center;margin:24px 0">
          <p style="color:#8a7060;font-size:0.85rem;margin:0 0 8px">Mã đặt lại mật khẩu</p>
          <span style="font-size:2.2rem;font-weight:800;color:#e74c3c;letter-spacing:8px">${otp}</span>
          <p style="color:#aaa;font-size:0.8rem;margin:10px 0 0">⏱ Mã có hiệu lực trong <strong>10 phút</strong></p>
        </div>
        <p style="color:#8a7060;font-size:0.85rem">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
      </div>
      <div style="background:#f5ede7;padding:16px 32px;text-align:center">
        <p style="color:#aaa;font-size:0.8rem;margin:0">© 2024 FangShi Pet Shop</p>
      </div>
    </div>`,
});

export default sendEmail;
