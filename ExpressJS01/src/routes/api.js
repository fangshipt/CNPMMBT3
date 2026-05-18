import express from 'express';

import * as userController from '../controllers/userController.js';

import auth from '../middleware/auth.js';
import delay from '../middleware/delay.js';

const routerAPI = express.Router();

routerAPI.get('/', (req, res) => {
    return res.status(200).json('Hello world api');
});

routerAPI.post('/register', userController.createUser);

routerAPI.post('/login', userController.handleLogin);

routerAPI.use(auth);

routerAPI.get('/user', userController.getUser);

routerAPI.get('/account', delay, userController.getAccount);

export default routerAPI;