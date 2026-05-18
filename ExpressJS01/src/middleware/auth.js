import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'change_this_secret';

const auth = (req, res, next) => {
    if (!req.headers.authorization?.split(' ')[1]) {
        return res.status(401).json({
            message: 'Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn'
        });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        console.log('>>> check token: ', decoded);

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token bị hết hạn/hoặc không hợp lệ'
        });
    }
}

const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        console.log('>>> check token: ', decoded);
    } catch (error) {
        console.log('>>> invalid token: ', error.message);
    }

    next();
};

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({
            message: 'Chỉ admin mới được thực hiện thao tác này'
        });
    }

    next();
};

export default auth;
export { isAdmin, optionalAuth };