import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrderService(req.user.id, req.body);
        return res.status(201).json({ EC: 0, EM: 'Đặt hàng thành công', data: order });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const result = await orderService.getUserOrdersService(req.user.id, {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            status,
        });
        return res.json({ EC: 0, EM: 'success', data: result });
    } catch (e) {
        return res.status(500).json({ EC: -1, EM: e.message });
    }
};

export const getOrderDetail = async (req, res) => {
    try {
        const order = await orderService.getOrderDetailService(req.user.id, req.params.id);
        return res.json({ EC: 0, EM: 'success', data: order });
    } catch (e) {
        return res.status(404).json({ EC: 1, EM: e.message });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrderService(req.user.id, req.params.id, req.body.reason);
        return res.json({ EC: 0, EM: 'success', data: order });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};

// Admin controllers
export const getAllOrders = async (req, res) => {
    try {
        const { page, limit, status } = req.query;
        const result = await orderService.getAllOrdersService({
            page: Number(page) || 1,
            limit: Number(limit) || 20,
            status,
        });
        return res.json({ EC: 0, EM: 'success', data: result });
    } catch (e) {
        return res.status(500).json({ EC: -1, EM: e.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;
        if (!status) return res.status(400).json({ EC: 1, EM: 'Thiếu trạng thái' });
        const order = await orderService.updateOrderStatusService(req.user.id, req.params.id, status, note);
        return res.json({ EC: 0, EM: 'Đã cập nhật trạng thái đơn hàng', data: order });
    } catch (e) {
        return res.status(400).json({ EC: 1, EM: e.message });
    }
};
