import express from 'express';
import { getApprovedTestimonials, getMyStatus, createTestimonial, getAllTestimonials, updateApproval, deleteTestimonial } from '../controllers/testimonialController.js';
import auth, { isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getApprovedTestimonials);
router.get('/my-status', auth, getMyStatus);
router.post('/', auth, createTestimonial);

// Admin
router.get('/', auth, isAdmin, getAllTestimonials);
router.patch('/:id/approve', auth, isAdmin, updateApproval);
router.delete('/:id', auth, isAdmin, deleteTestimonial);

export default router;
