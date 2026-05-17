require("dotenv").config();

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "change_this_secret";

const auth = (req, res, next) => {
    if (!req.headers.authorization?.split(' ')[1]) {
        return res.status(401).json({
            message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
        });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            email: decoded.email,
            name: decoded.name,
            createdBy: "hoidanit"
        };

        console.log(">>> check token: ", decoded);

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token bị hết hạn/hoặc không hợp lệ"
        });
    }
}

module.exports = auth;