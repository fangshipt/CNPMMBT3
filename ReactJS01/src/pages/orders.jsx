import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Select, Empty, Spin, Pagination } from 'antd';
import { getUserOrdersApi, formatPrice } from '../util/api';
import { AuthContext } from '../components/context/authContext';

const STATUS_CONFIG = {
    pending:          { label: 'Đơn hàng mới',              color: 'blue' },
    confirmed:        { label: 'Đã xác nhận',               color: 'cyan' },
    preparing:        { label: 'Đang chuẩn bị hàng',        color: 'purple' },
    shipping:         { label: 'Đang giao hàng',            color: 'orange' },
    delivered:        { label: 'Đã giao thành công',        color: 'green' },
    cancelled:        { label: 'Đã hủy',                    color: 'red' },
    cancel_requested: { label: 'Yêu cầu hủy',              color: 'volcano' },
};

function OrdersPage() {
    const { auth } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!auth.isAuthenticated) return;
        const load = async () => {
            setLoading(true);
            const res = await getUserOrdersApi({ page, limit: 10, status: statusFilter });
            if (res?.EC === 0) { setOrders(res.data.orders); setTotal(res.data.total); }
            setLoading(false);
        };
        load();
    }, [auth.isAuthenticated, page, statusFilter]);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (!auth.isAuthenticated) return (
        <div style={{ background: '#F9F3EC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Vui lòng <Link to="/login">đăng nhập</Link> để xem đơn hàng</p>
        </div>
    );

    return (
        <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
            <div className="container py-5">
                <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
                    <h2 className="fw-normal m-0" style={{ color: '#3a2e28' }}>
                        <iconify-icon icon="ph:package" class="me-2"></iconify-icon>
                        Đơn hàng của tôi
                    </h2>
                    <Select
                        allowClear placeholder="Lọc theo trạng thái" style={{ width: 200 }}
                        value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }}>
                        {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                            <Select.Option key={key} value={key}>{label}</Select.Option>
                        ))}
                    </Select>
                </div>

                {loading ? (
                    <div className="text-center py-5"><Spin size="large" /></div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                        <Empty description="Chưa có đơn hàng nào" />
                        <Link to="/products"><button className="btn btn-primary mt-3">Mua sắm ngay</button></Link>
                    </div>
                ) : (
                    <>
                        {orders.map(order => {
                            const cfg = STATUS_CONFIG[order.status] || { label: order.status, color: 'default' };
                            return (
                                <div key={order._id} className="bg-white rounded-4 shadow-sm p-4 mb-3">
                                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                                        <div>
                                            <span className="text-muted small me-3">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-muted small">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <Tag color={cfg.color} style={{ fontSize: '0.85rem', padding: '2px 12px' }}>{cfg.label}</Tag>
                                    </div>

                                    <div className="d-flex flex-wrap gap-3 mb-3">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="d-flex align-items-center gap-2">
                                                <div className="text-muted small">{item.name} x{item.quantity}</div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && <span className="text-muted small">+{order.items.length - 3} sản phẩm khác</span>}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-muted small">Tổng tiền: </span>
                                            <strong className="text-primary">{formatPrice(order.totalAmount)}</strong>
                                            <span className="ms-2 text-muted small">• COD</span>
                                        </div>
                                        <Link to={`/orders/${order._id}`}>
                                            <button className="btn btn-sm btn-outline-primary rounded-2">Xem chi tiết</button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                        <Pagination current={page} total={total} pageSize={10} onChange={setPage} className="mt-4 d-flex justify-content-center" />
                    </>
                )}
            </div>
        </div>
    );
}

export default OrdersPage;
