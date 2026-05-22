import { getApprovedTestimonialsService, getAllTestimonialsService, getMyStatusService, createTestimonialService, updateApprovalService, deleteTestimonialService } from '../services/testimonialService.js';

export const getApprovedTestimonials = async (req, res) => {
    try {
        const data = await getApprovedTestimonialsService(Number(req.query.limit) || 10);
        res.json({ EC: 0, EM: 'OK', data });
    } catch (e) {
        res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const getMyStatus = async (req, res) => {
    try {
        const data = await getMyStatusService(req.user._id);
        res.json({ EC: 0, EM: 'OK', data });
    } catch (e) {
        res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const t = await createTestimonialService(req.user._id, req.body);
        res.status(201).json({ EC: 0, EM: 'Lời nhắn đã được gửi, chờ duyệt', data: t });
    } catch (e) {
        res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const getAllTestimonials = async (req, res) => {
    try {
        const data = await getAllTestimonialsService();
        res.json({ EC: 0, EM: 'OK', data });
    } catch (e) {
        res.status(500).json({ EC: 1, EM: e.message });
    }
};

export const updateApproval = async (req, res) => {
    try {
        const t = await updateApprovalService(req.params.id, req.body.isApproved);
        res.json({ EC: 0, EM: 'Đã cập nhật', data: t });
    } catch (e) {
        res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        await deleteTestimonialService(req.params.id);
        res.json({ EC: 0, EM: 'Đã xóa' });
    } catch (e) {
        res.status(400).json({ EC: 1, EM: e.message });
    }
};
