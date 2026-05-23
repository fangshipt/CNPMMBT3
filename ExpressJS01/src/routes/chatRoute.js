import express from 'express';
import * as chatController from '../controllers/chatController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes (auth applied in server.js)
router.get('/my', chatController.getUserChat);
router.post('/my', chatController.sendUserMessage);

// Admin routes
router.get('/admin/all', isAdmin, chatController.getAllChats);
router.get('/admin/:userId', isAdmin, chatController.getAdminChatByUser);
router.post('/admin/:userId', isAdmin, chatController.adminReply);

export default router;
