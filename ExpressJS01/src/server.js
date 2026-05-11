require('dotenv').config();

// import các nguồn cần dùng
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const apiRoutes = require('./routes/api');
const connection = require('./config/database');
const { getHomepage } = require('./controllers/homeController');
const cors = require('cors');

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

webAPI.get("/", getHomepage);

app.use('/', webAPI);

// khai báo route cho API
app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        // kết nối database
        await connection();

        // lắng nghe port
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });

    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();