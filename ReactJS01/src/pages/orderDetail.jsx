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
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Link to="/orders" className="text-muted" style={{ fontSize: '0.9rem' }}>
                        <iconify-icon icon="ph:arrow-left" class="me-1"></iconify-icon>Đơn hàng của tôi
                    </Link>
                    <span className="text-muted">/</span>
                    <span style={{ color: '#3a2e28', fontSize: '0.9rem' }}>{order.orderCode || '#' + order._id.slice(-8).toUpperCase()}</span>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Trạng thái */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-semibold m-0" style={{ color: '#3a2e28' }}>Trạng thái đơn hàng</h5>
                                <Tag color={cfg.color} style={{ fontSize: '0.9rem', padding: '4px 14px' }}>{cfg.label}</Tag>
                            </div>

                            {/* Progress bar cho các đơn thông thường */}
                            {!['cancelled', 'cancel_requested'].includes(order.status) && (
                                <div className="d-flex align-items-center mb-4">
                                    {ORDER_STEPS.map((step, idx) => {
                                        const stepCfg = STATUS_CONFIG[step];
                                        const currentIdx = ORDER_STEPS.indexOf(order.status);
                                        const done = idx <= currentIdx;
                                        return (
                                            <div key={step} className="d-flex align-items-center flex-grow-1">
                                                <div className="d-flex flex-column align-items-center" style={{ minWidth: 60 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: done ? '#ff6b35' : '#e0d5ca', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <iconify-icon icon={stepCfg.icon} style={{ color: '#fff', fontSize: '1rem' }}></iconify-icon>
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', color: done ? '#ff6b35' : '#aaa', textAlign: 'center', marginTop: 4, maxWidth: 70 }}>{stepCfg.label}</span>
                                                </div>
                                                {idx < ORDER_STEPS.length - 1 && (
                                                    <div style={{ flex: 1, height: 2, background: idx < currentIdx ? '#ff6b35' : '#e0d5ca', margin: '0 4px', marginBottom: 24 }}></div>
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
                                                {h.note && <span className="text-muted small ms-2">{h.note}</span>}
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{formatDate(h.createdAt)}</div>
                                            </div>
                                        ),
                                    }))}
                                />
                            )}
                        </div>

                        {/* Sản phẩm */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Sản phẩm đặt hàng</h5>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="d-flex align-items-center gap-3 py-2" style={{ borderBottom: '1px solid #f0e8df' }}>
                                    <img src={item.image ? getImageUrl(item.image) : '/assets/placeholder.png'} alt={item.name}
                                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                                    <div className="flex-grow-1">
                                        <div className="fw-semibold" style={{ color: '#3a2e28' }}>{item.name}</div>
                                        <div className="text-muted small">Đơn giá: {formatPrice(item.price)}</div>
                                    </div>
                                    <div className="text-end">
                                        <div className="text-muted small">x{item.quantity}</div>
                                        <div className="fw-bold text-primary">{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                </div>
                            ))}
                            <div className="d-flex justify-content-between pt-3">
                                <span className="fw-semibold">Tổng thanh toán</span>
                                <strong className="text-primary fs-5">{formatPrice(order.totalAmount)}</strong>
                            </div>
                        </div>

                        {canCancel && (
                            <div className="text-end">
                                <Button danger onClick={() => setCancelModal(true)}>
                                    <iconify-icon icon="ph:x-circle" class="me-2"></iconify-icon>
                                    {cancelLabel}
                                </Button>
                            </div>
                        )}
                        {order.status === 'pending' && minutesSince > 30 && (
                            <p className="text-muted small text-end mt-1">Đã quá 30 phút, không thể hủy tự do. Liên hệ shop nếu cần hỗ trợ.</p>
                        )}
                    </div>

                    <div className="col-lg-4">
                        {/* Địa chỉ giao hàng */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Địa chỉ giao hàng</h5>
                            <div className="fw-semibold mb-1">{order.shippingAddress?.recipientName}</div>
                            <div className="text-muted small mb-1">{order.shippingAddress?.phone}</div>
                            <div className="text-muted small">
                                {order.shippingAddress?.detail}, {order.shippingAddress?.ward},<br />
                                {order.shippingAddress?.district}, {order.shippingAddress?.province}
                            </div>
                        </div>

                        {/* Thanh toán */}
                        <div className="bg-white rounded-4 shadow-sm p-4">
                            <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Thông tin thanh toán</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted small">Phương thức</span>
                                {order.paymentMethod === 'VNPAY'
                                    ? <Tag color="blue">VNPay - Thanh toán online</Tag>
                                    : <Tag color="default">COD - Tiền mặt</Tag>
                                }
                            </div>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted small">Tổng tiền</span>
                                <strong className="text-primary">{formatPrice(order.totalAmount)}</strong>
                            </div>
                            {order.cancelReason && (
                                <div className="mt-3 p-3 rounded-3" style={{ background: '#fff5f5', border: '1px solid #ffcccc' }}>
                                    <div className="text-danger small fw-semibold">Lý do hủy:</div>
                                    <div className="text-muted small">{order.cancelReason}</div>
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
                <p className="text-muted mb-3">
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
