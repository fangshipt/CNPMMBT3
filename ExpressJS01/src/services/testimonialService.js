import Testimonial from '../models/testimonial.js';
import Order from '../models/order.js';

export const getApprovedTestimonialsService = async (limit = 10) => {
    return Testimonial.find({ isApproved: true })
        .populate('user', 'fullName')
        .sort({ createdAt: -1 })
        .limit(limit);
};

export const getAllTestimonialsService = async () => {
    return Testimonial.find()
        .populate('user', 'fullName email')
        .sort({ createdAt: -1 });
};

export const getMyStatusService = async (userId) => {
    const [hasDelivered, existing] = await Promise.all([
        Order.exists({ user: userId, status: 'delivered' }),
        Testimonial.findOne({ user: userId }),
    ]);
    return {
        hasDeliveredOrder: !!hasDelivered,
        hasSubmitted: !!existing,
        isApproved: existing?.isApproved || false,
    };
};

export const createTestimonialService = async (userId, { content, rating }) => {
    const hasDelivered = await Order.exists({ user: userId, status: 'delivered' });
    if (!hasDelivered) throw new Error('Bạn cần có đơn hàng đã giao thành công để gửi lời nhắn');
    const existing = await Testimonial.findOne({ user: userId });
    if (existing) throw new Error('Bạn đã gửi lời nhắn rồi');
    return Testimonial.create({ user: userId, content, rating: rating || 5 });
};

export const updateApprovalService = async (id, isApproved) => {
    const t = await Testimonial.findByIdAndUpdate(id, { isApproved }, { new: true });
    if (!t) throw new Error('Không tìm thấy lời nhắn');
    return t;
};

export const deleteTestimonialService = async (id) => {
    const t = await Testimonial.findByIdAndDelete(id);
    if (!t) throw new Error('Không tìm thấy lời nhắn');
    return t;
};
