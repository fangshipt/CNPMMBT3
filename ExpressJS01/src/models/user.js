import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Kích hoạt tài khoản qua OTP
    isActive: { type: Boolean, default: false },

    // OTP dùng chung cho kích hoạt và quên mật khẩu
    otp:       { type: String,  default: null },
    otpExpiry: { type: Date,    default: null },
    otpType:   { type: String,  enum: ['activate', 'forgot_password'], default: null },

    // Theo dõi đăng nhập sai để khoá tài khoản
    loginAttempts: { type: Number, default: 0 },
    lockUntil:     { type: Date,   default: null },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;