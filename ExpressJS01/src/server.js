import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoute.js';
import configViewEngine from './config/viewEngine.js';
import apiRoutes from './routes/api.js';
import connection from './config/database.js';
import { getHomepage } from './controllers/homeController.js';

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