import express from 'express';
import { getPublishedBlogs, getBlogBySlug, getBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import auth, { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/published', getPublishedBlogs);
router.get('/published/:slug', getBlogBySlug);

// Admin routes
router.get('/', auth, isAdmin, getBlogs);
router.post('/', auth, isAdmin, createBlog);
router.put('/:id', auth, isAdmin, updateBlog);
router.delete('/:id', auth, isAdmin, deleteBlog);

export default router;
