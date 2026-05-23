import { PayOS } from '@payos/node';

const payos = new PayOS();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const createPaymentLink = async (order) => {
    const payosCode = parseInt(Date.now().toString().slice(-9));
    const items = order.items.map(item => ({
        name: item.name.substring(0, 25),
        quantity: item.quantity,
        price: Math.round(item.price),
    }));

    const result = await payos.paymentRequests.create({
        orderCode: payosCode,
        amount: Math.round(order.totalAmount),
        description: `DH ${order.orderCode}`.substring(0, 25),
        cancelUrl: `${FRONTEND_URL}/checkout`,
        returnUrl: `${FRONTEND_URL}/payment/result`,
        items,
    });

    return { payosCode, checkoutUrl: result.checkoutUrl };
};

export const verifyWebhookData = (webhookBody) => {
    return payos.webhooks.constructEvent(webhookBody);
};
