import dotenv from 'dotenv';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';
const jwtExpire = process.env.JWT_EXPIRE || '1d';

export const createUserService = async (name, email, password) => {
    try {

        if (!name || !email || !password) {
            return {
                EC: 1,
                EM: 'Vui lòng điền đầy đủ tên, email và mật khẩu'
            };
        }

        const user = await User.findOne({ email });

        if (user) {
            return {
                EC: 1,
                EM: 'Email đã tồn tại'
            };
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        let result = await User.create({
            fullName: name,
            email,
            password: hashPassword,
            role: 'customer'
        });

        return {
            EC: 0,
            EM: 'Đăng ký tài khoản thành công',
            user: {
                email: result.email,
                fullName: result.fullName
            }
        };

    } catch (error) {
        console.log(error);
        return {
            EC: -1,
            EM: 'Lỗi server'
        };
    }
}

export const loginService = async (email, password) => {
    try {

        if (!email || !password) {
            return {
                EC: 1,
                EM: 'Vui lòng nhập email và mật khẩu'
            };
        }

        const user = await User.findOne({ email });

        if (!user) {
            return {
                EC: 1,
                EM: 'Email/Password không hợp lệ'
            };
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return {
                EC: 2,
                EM: 'Email/Password không hợp lệ'
            };
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        const access_token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire });

        return {
            EC: 0,
            access_token,
            user: {
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        };

    } catch (error) {
        console.log(error);
        return {
            EC: -1,
            EM: 'Lỗi server'
        };
    }
}

export const getUserService = async () => {
    try {
        let result = await User.find({}).select('-password');
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}