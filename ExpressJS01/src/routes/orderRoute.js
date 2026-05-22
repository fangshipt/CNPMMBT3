import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', orderController.createOrder);
router.get('/my', orderController.getUserOrders);
router.get('/my/:id', orderController.getOrderDetail);
router.patch('/my/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/admin', isAdmin, orderController.getAllOrders);
router.patch('/admin/:id/status', isAdmin, orderController.updateOrderStatus);

export default router;
