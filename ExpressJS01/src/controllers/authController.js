import {
  registerService,
  loginService,
} from "../services/authService.js";

const register = async (req, res) => {
  try {
    const data = await registerService(req.body);

    return res.status(201).json({
      message: "Đăng ký thành công",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const data = await loginService(req.body);

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export {
  register,
  login,
};