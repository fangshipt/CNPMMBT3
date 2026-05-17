require("dotenv").config();

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || "change_this_secret";
const jwtExpire = process.env.JWT_EXPIRE || "1d";

const createUserService = async (name, email, password) => {
    try {

        // check required fields
        if (!name || !email || !password) {
            return {
                EC: 1,
                EM: "Vui lòng điền đầy đủ tên, email và mật khẩu"
            };
        }

        // check user exist
        const user = await User.findOne({ email });

        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return {
                EC: 1,
                EM: "Email đã tồn tại"
            };
        }

        // hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds);

        // save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "User"
        });

        return {
            EC: 0,
            EM: "Đăng ký tài khoản thành công",
            user: {
                email: result.email,
                name: result.name
            }
        };

    } catch (error) {
        console.log(error);
        return {
            EC: -1,
            EM: "Lỗi server"
        };
    }
}

const loginService = async (email, password) => {
    try {

        if (!email || !password) {
            return {
                EC: 1,
                EM: "Vui lòng nhập email và mật khẩu"
            };
        }

        // fetch user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            };
        }

        // compare password
        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
            return {
                EC: 2,
                EM: "Email/Password không hợp lệ"
            };
        }

        // create an access token
        const payload = {
            email: user.email,
            name: user.name
        };

        const access_token = jwt.sign(
            payload,
            jwtSecret,
            {
                expiresIn: jwtExpire
            }
        );

        return {
            EC: 0,
            access_token,
            user: {
                email: user.email,
                name: user.name
            }
        };

    } catch (error) {
        console.log(error);
        return {
            EC: -1,
            EM: "Lỗi server"
        };
    }
}

const getUserService = async () => {

    try {

        let result = await User.find({}).select("-password");

        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createUserService,
    loginService,
    getUserService
}