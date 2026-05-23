import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { clearCartService } from './cartService.js';
import { createPaymentLink } from './payosService.js';

const generateOrderCode = async () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yy = String(now.getFullYear()).slice(2);

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const countToday = await Order.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const seq = String(countToday + 1).padStart(4, '0');
    return `FS${dd}${mm}${yy}${seq}`;
};

export const createOrderService = async (userId, { addressId, notes, items: manualItems, shippingFee = 0, paymentMethod = 'COD' }) => {
    let orderItems = [];
    let totalAmount = 0;

    if (manualItems && manualItems.length > 0) {
        for (const item of manualItems) {
            const product = await Product.findById(item.product);
            if (!product || !product.isActive) throw new Error(`Sản phẩm không hợp lệ`);
            if (product.stock < item.quantity) throw new Error(`"${product.name}" không đủ hàng`);
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;
            orderItems.push({ product: product._id, name: product.name, image: product.images?.[0] || '', price, quantity: item.quantity });
            totalAmount += price * item.quantity;
        }
    } else {
        const cart = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) throw new Error('Giỏ hàng trống');
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product || !product.isActive) throw new Error(`Sản phẩm "${item.name}" không còn tồn tại`);
            if (product.stock < item.quantity) throw new Error(`"${product.name}" không đủ hàng`);
            orderItems.push({ product: product._id, name: item.name, image: item.image, price: item.price, quantity: item.quantity });
            totalAmount += item.price * item.quantity;
        }
    }

    let shippingAddress;
    if (addressId) {
        const Address = (await import('../models/address.js')).default;
        const addr = await Address.findOne({ _id: addressId, user: userId });
        if (!addr) throw new Error('Địa chỉ không hợp lệ');
        shippingAddress = { recipientName: addr.recipientName, phone: addr.phone, province: addr.province, district: addr.district, ward: addr.ward, detail: addr.detail };
    } else {
        throw new Error('Vui lòng chọn địa chỉ giao hàng');
    }

    const orderCode = await generateOrderCode();
    const order = await Order.create({
        orderCode,
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'paid' : 'pending',
        totalAmount: totalAmount + Number(shippingFee || 0),
        shippingFee: Number(shippingFee || 0),
        notes: notes || '',
        statusHistory: [{ status: 'pending', note: 'Đơn hàng được tạo' }],
    });

    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    if (!manualItems || manualItems.length === 0) {
        await clearCartService(userId);
    }

    if (paymentMethod === 'VNPAY') {
        try {
            const { payosCode, checkoutUrl } = await createPaymentLink(order);
            order.payosOrderCode = payosCode;
            await order.save();
            return { order, paymentUrl: checkoutUrl };
        } catch (e) {
            return { order, paymentUrl: null };
        }
    }

    return { order, paymentUrl: null };
};

export const getUserOrdersService = async (userId, { page = 1, limit = 10, status } = {}) => {
    const query = { user: userId };
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments(query),
    ]);
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
};

export const getOrderDetailService = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error('Đơn hàng không tồn tại');
    return order;
};

export const cancelOrderService = async (userId, orderId, reason = '') => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error('Đơn hàng không tồn tại');

    const nonCancellable = ['shipping', 'delivered', 'cancelled'];
    if (nonCancellable.includes(order.status)) {
        throw new Error('Không thể hủy đơn hàng ở trạng thái này');
    }

    const minutesSinceOrder = (Date.now() - new Date(order.createdAt).getTime()) / 60000;

    if (order.status === 'preparing') {
        order.status = 'cancel_requested';
        order.cancelReason = reason;
        order.statusHistory.push({ status: 'cancel_requested', note: `Khách hàng yêu cầu hủy: ${reason}` });
    } else if (minutesSinceOrder <= 30) {
        order.status = 'cancelled';
        order.cancelReason = reason;
        order.statusHistory.push({ status: 'cancelled', note: `Khách hàng hủy: ${reason}` });
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
    } else {
        throw new Error('Chỉ có thể hủy đơn hàng trong vòng 30 phút sau khi đặt');
    }

    await order.save();
    return order;
};

// Admin services
export const getAllOrdersService = async ({ page = 1, limit = 20, status, orderCode } = {}) => {
    const query = {};
    if (status) query.status = status;
    if (orderCode) query.orderCode = { $regex: orderCode, $options: 'i' };
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
        Order.find(query).populate('user', 'fullName email').sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments(query),
    ]);
    return { orders, total, page, totalPages: Math.ceil(total / limit) };
};

export const updateOrderStatusService = async (adminId, orderId, status, note = '') => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Đơn hàng không tồn tại');

    const validTransitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['preparing', 'cancelled'],
        preparing: ['shipping'],
        shipping: ['delivered'],
        cancel_requested: ['cancelled', 'preparing'],
    };

    if (!validTransitions[order.status]?.includes(status)) {
        throw new Error(`Không thể chuyển từ "${order.status}" sang "${status}"`);
    }

    if (status === 'cancelled') {
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
    }

    if (status === 'delivered') {
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, { $inc: { sold: item.quantity } });
        }
        order.paymentStatus = 'paid';
    }

    order.status = status;
    order.statusHistory.push({ status, note, changedBy: adminId });
    await order.save();
    return order;
};

export const getRevenueService = async ({ year } = {}) => {
    const targetYear = parseInt(year) || new Date().getFullYear();
    const start = new Date(targetYear, 0, 1);
    const end = new Date(targetYear + 1, 0, 1);

    const [deliveredOrders, pendingCount, cancelledCount] = await Promise.all([
        Order.find({ status: 'delivered', createdAt: { $gte: start, $lt: end } }).select('totalAmount shippingFee createdAt'),
        Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing', 'shipping'] } }),
        Order.countDocuments({ status: 'cancelled', createdAt: { $gte: start, $lt: end } }),
    ]);

    const monthly = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, revenue: 0, orders: 0 }));
    for (const order of deliveredOrders) {
        const m = order.createdAt.getMonth();
        monthly[m].revenue += order.totalAmount;
        monthly[m].orders++;
    }

    const totalRevenue = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0);
    return { monthly, totalRevenue, totalOrders: deliveredOrders.length, pendingCount, cancelledCount, year: targetYear };
};
