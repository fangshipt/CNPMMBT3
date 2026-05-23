import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import configViewEngine from './config/viewEngine.js';
import apiRoutes from './routes/api.js';
import connection from './config/database.js';
import { getHomepage } from './controllers/homeController.js';
import uploadRoute from "./routes/uploadRoute.js";
import cartRoute from "./routes/cartRoute.js";
import addressRoute from "./routes/addressRoute.js";
import orderRoute from "./routes/orderRoute.js";
import promotionRoute from "./routes/promotionRoute.js";
import blogRoute from "./routes/blogRoute.js";
import testimonialRoute from "./routes/testimonialRoute.js";
import chatRoute from "./routes/chatRoute.js";
import auth from './middleware/auth.js';

const app = express();

// cấu hình port
const port = process.env.PORT || 8888;

// config cors
app.use(cors());

// config req.body cho json
app.use(express.json());

// for form data
app.use(express.urlencoded({ extended: true }));

// config template engine
configViewEngine(app);

// config route cho view ejs
const webAPI = express.Router();
webAPI.get('/', getHomepage);
app.use('/', webAPI);

// khai báo route cho API
app.use('/v1/api/', apiRoutes);

// khai báo auth route
app.use('/api/auth', authRoute);

// khai báo upload route
app.use('/api/upload', uploadRoute);

// khai báo cart, address, order routes (yêu cầu auth)
app.use('/v1/api/cart', auth, cartRoute);
app.use('/v1/api/addresses', auth, addressRoute);
app.use('/v1/api/orders', auth, orderRoute);
app.use('/v1/api/promotions', promotionRoute);
app.use('/v1/api/blogs', blogRoute);
app.use('/v1/api/testimonials', testimonialRoute);
app.use('/v1/api/chat', auth, chatRoute);

(async () => {
    try {
        // kết nối database
        await connection();

        // lắng nghe port
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });

    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
    }
})();