import bcrypt from "bcryptjs";
import User from "../models/user.js";
import createToken from "../utils/createToken.js";

const registerService = async (body) => {
  const { fullName, email, password, confirmPassword } = body;

  // validate
  if (!fullName || !email || !password || !confirmPassword) {
    throw new Error("Vui lòng nhập đầy đủ thông tin");
  }

  if (password !== confirmPassword) {
    throw new Error("Mật khẩu xác nhận không khớp");
  }

  if (password.length < 6) {
    throw new Error("Mật khẩu tối thiểu 6 ký tự");
  }

  // check email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  // create token
  const access_token = createToken(user);

  return {
    access_token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

const loginService = async (body) => {
  const { email, password } = body;

  // check user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  // token
  const access_token = createToken(user);

  return {
    access_token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

export {
  registerService,
  loginService,
};