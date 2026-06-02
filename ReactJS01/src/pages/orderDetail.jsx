import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tag, Timeline, Button, Modal, Input, Spin, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getOrderDetailApi, cancelOrderApi, formatPrice, getImageUrl } from '../util/api';
import { AuthContext } from '../components/context/authContext';

const STATUS_CONFIG = {
    pending:          { label: 'Đơn hàng mới',              color: 'blue',    icon: 'ph:clock' },
    confirmed:        { label: 'Đã xác nhận',               color: 'cyan',    icon: 'ph:check' },
    preparing:        { label: 'Đang chuẩn bị hàng',        color: 'purple',  icon: 'ph:package' },
    shipping:         { label: 'Đang giao hàng',            color: 'orange',  icon: 'ph:truck' },
    delivered:        { label: 'Đã giao thành công',        color: 'green',   icon: 'ph:check-circle' },
    cancelled:        { label: 'Đã hủy',                    color: 'red',     icon: 'ph:x-circle' },
    cancel_requested: { label: 'Yêu cầu hủy',              color: 'volcano', icon: 'ph:warning' },
};

const ORDER_STEPS = ['pending', 'confirmed', 'preparing', 'shipping', 'delivered'];

function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const loadOrder = async () => {
        setLoading(true);
        const res = await getOrderDetailApi(id);
        if (res?.EC === 0) setOrder(res.data);
        else navigate('/orders');
        setLoading(false);
    };

    useEffect(() => {
        if (!auth.isAuthenticated) { navigate('/login'); return; }
        loadOrder();
    }, [id, auth.isAuthenticated]);

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;
    if (!order) return null;

    const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: 'default' };
    const minutesSince = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
    const canCancel = !['shipping', 'delivered', 'cancelled'].includes(order.status) &&
        (order.status !== 'pending' && order.status !== 'confirmed' ? true : minutesSince <= 30);
    const cancelLabel = order.status === 'preparing' ? 'Gửi yêu cầu hủy đơn' : 'Hủy đơn hàng';

    const handleCancel = async () => {
        if (!cancelReason.trim()) { message.warning('Vui lòng nhập lý do hủy'); return; }
        setCancelling(true);
        const res = await cancelOrderApi(id, cancelReason);
        setCancelling(false);
        if (res?.EC === 0) {
            message.success(res.EM || 'Thành công');
            setCancelModal(false);
            loadOrder();
        } else {
            message.error(res?.EM || 'Có lỗi xảy ra');
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
            <div className="container py-5">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <Link to="/orders" style={{ color: '#8a7060', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <iconify-icon icon="ph:arrow-left"></iconify-icon>Đơn hàng của tôi
                    </Link>
                    <span style={{ color: '#ccc' }}>/</span>
                    <span style={{ color: '#3a2e28', fontSize: '0.9rem', fontWeight: 600 }}>{order.orderCode || '#' + order._id.slice(-8).toUpperCase()}</span>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Trạng thái */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h5 style={{ fontWeight: 700, margin: 0, color: '#3a2e28' }}>Trạng thái đơn hàng</h5>
                                <Tag color={cfg.color} style={{ fontSize: '0.9rem', padding: '4px 14px' }}>{cfg.label}</Tag>
                            </div>

                            {/* Progress bar cho các đơn thông thường */}
                            {!['cancelled', 'cancel_requested'].includes(order.status) && (
                                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 24 }}>
                                    {ORDER_STEPS.map((step, idx) => {
                                        const stepCfg = STATUS_CONFIG[step];
                                        const currentIdx = ORDER_STEPS.indexOf(order.status);
                                        const done = idx <= currentIdx;
                                        return (
                                            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 }}>
                                                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: done ? '#ff6b35' : '#e0d5ca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <iconify-icon icon={stepCfg.icon} style={{ color: '#fff', fontSize: '1rem' }}></iconify-icon>
                                                    </div>
                                                    <span style={{ fontSize: '0.68rem', color: done ? '#ff6b35' : '#aaa', textAlign: 'center', marginTop: 5, maxWidth: 64, lineHeight: 1.3 }}>{stepCfg.label}</span>
                                                </div>
                                                {idx < ORDER_STEPS.length - 1 && (
                                                    <div style={{ flex: 1, height: 2, background: idx < currentIdx ? '#ff6b35' : '#e0d5ca', margin: '0 4px', marginBottom: 22, flexShrink: 1 }}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Lịch sử trạng thái */}
                            {order.statusHistory?.length > 0 && (
                                <Timeline
                                    items={[...order.statusHistory].reverse().map(h => ({
                                        color: STATUS_CONFIG[h.status]?.color || 'gray',
                                        children: (
                                            <div>
                                                <Tag color={STATUS_CONFIG[h.status]?.color}>{STATUS_CONFIG[h.status]?.label || h.status}</Tag>
                                                {h.note && <span style={{ color: '#8a7060', fontSize: '0.82rem', marginLeft: 8 }}>{h.note}</span>}
                                                <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: 2 }}>{formatDate(h.createdAt)}</div>
                                            </div>
                                        ),
                                    }))}
                                />
                            )}
                        </div>

                        {/* Sản phẩm */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#3a2e28' }}>Sản phẩm đặt hàng</h5>
                            {order.items.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f0e8df' }}>
                                    <Link to={`/products/${item.slug || item.product}`} style={{ flexShrink: 0 }}>
                                        <img src={item.image ? getImageUrl(item.image) : '/assets/placeholder.png'} alt={item.name}
                                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, border: '1px solid #f0e8df', display: 'block' }} />
                                    </Link>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Link to={`/products/${item.slug || item.product}`} style={{ textDecoration: 'none' }}>
                                            <div style={{ fontWeight: 600, color: '#3a2e28', fontSize: '0.9rem', marginBottom: 3 }}>{item.name}</div>
                                        </Link>
                                        <div style={{ fontSize: '0.8rem', color: '#8a7060' }}>Đơn giá: <span style={{ color: '#ff6b35', fontWeight: 600 }}>{formatPrice(item.price)}</span></div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '0.82rem', color: '#aaa', marginBottom: 3 }}>x{item.quantity}</div>
                                        <div style={{ fontWeight: 700, color: '#ff6b35', fontSize: '0.95rem' }}>{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14 }}>
                                <span style={{ fontWeight: 700, color: '#3a2e28' }}>Tổng thanh toán:</span>
                                <strong style={{ color: '#ff6b35', fontSize: '1.1rem' }}>{formatPrice(order.totalAmount)}</strong>
                            </div>
                        </div>

                        {canCancel && (
                            <div style={{ textAlign: 'right' }}>
                                <Button danger onClick={() => setCancelModal(true)}>
                                    {cancelLabel}
                                </Button>
                            </div>
                        )}
                        {order.status === 'pending' && minutesSince > 30 && (
                            <p style={{ color: '#8a7060', fontSize: '0.8rem', textAlign: 'right', marginTop: 6 }}>Đã quá 30 phút, không thể hủy tự do. Liên hệ shop nếu cần hỗ trợ.</p>
                        )}
                    </div>

                    <div className="col-lg-4">
                        {/* Địa chỉ giao hàng */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#3a2e28' }}>Địa chỉ giao hàng</h5>
                            <div style={{ fontWeight: 600, color: '#3a2e28', marginBottom: 6 }}>{order.shippingAddress?.recipientName}</div>
                            <div style={{ fontSize: '0.85rem', color: '#8a7060', marginBottom: 4 }}>{order.shippingAddress?.phone}</div>
                            <div style={{ fontSize: '0.85rem', color: '#8a7060', lineHeight: 1.6 }}>
                                {order.shippingAddress?.detail}, {order.shippingAddress?.ward},<br />
                                {order.shippingAddress?.district}, {order.shippingAddress?.province}
                            </div>
                        </div>

                        {/* Thanh toán */}
                        <div className="bg-white rounded-4 shadow-sm p-4">
                            <h5 style={{ fontWeight: 700, marginBottom: 16, color: '#3a2e28' }}>Thông tin thanh toán</h5>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontSize: '0.85rem', color: '#8a7060', fontWeight: 500 }}>Phương thức:</span>
                                {order.paymentMethod === 'VNPAY'
                                    ? <Tag color="blue">VNPay - Online</Tag>
                                    : <Tag color="default">COD - Tiền mặt</Tag>
                                }
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '0.85rem', color: '#8a7060', fontWeight: 500 }}>Phí vận chuyển:</span>
                                <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.9rem' }}>Miễn phí</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10, paddingTop: 12, borderTop: '1px solid #f0e8df' }}>
                                <span style={{ fontWeight: 700, color: '#3a2e28' }}>Tổng tiền:</span>
                                <strong style={{ color: '#ff6b35', fontSize: '1.1rem' }}>{formatPrice(order.totalAmount)}</strong>
                            </div>
                            {order.cancelReason && (
                                <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: '#fff5f5', border: '1px solid #ffcccc' }}>
                                    <div style={{ color: '#e74c3c', fontSize: '0.82rem', fontWeight: 600, marginBottom: 4 }}>Lý do hủy:</div>
                                    <div style={{ color: '#8a7060', fontSize: '0.82rem' }}>{order.cancelReason}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={<><ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />{cancelLabel}</>}
                open={cancelModal}
                onOk={handleCancel}
                onCancel={() => { setCancelModal(false); setCancelReason(''); }}
                okText="Xác nhận"
                cancelText="Đóng"
                okButtonProps={{ danger: true, loading: cancelling }}
            >
                <p style={{ color: '#8a7060', marginBottom: 12 }}>
                    {order.status === 'preparing'
                        ? 'Shop đang chuẩn bị hàng. Yêu cầu hủy sẽ được gửi đến shop để xác nhận.'
                        : 'Bạn có chắc muốn hủy đơn hàng này không?'}
                </p>
                <Input.TextArea
                    rows={3}
                    placeholder="Nhập lý do hủy đơn..."
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                />
            </Modal>
        </div>
    );
}

export default OrderDetailPage;
