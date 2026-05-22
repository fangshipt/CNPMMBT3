import express from 'express';

import * as userController from '../controllers/userController.js';
import categoryRoute from './categoryRoute.js';
import productRoute from './productRoute.js';

import auth from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';
import delay from '../middleware/delay.js';

const routerAPI = express.Router();

routerAPI.get('/', (req, res) => {
    return res.status(200).json('Hello world api');
});

routerAPI.post('/register', userController.createUser);

routerAPI.post('/login', userController.handleLogin);

// Public product routes
routerAPI.use('/products', optionalAuth, productRoute);

routerAPI.use(auth);

routerAPI.use('/categories', categoryRoute);

routerAPI.get('/user', userController.getUser);

routerAPI.get('/account', delay, userController.getAccount);

// Wishlist routes
routerAPI.get('/user/wishlist', userController.getWishlist);
routerAPI.post('/user/wishlist/:productId', userController.toggleWishlist);

export default routerAPI;
