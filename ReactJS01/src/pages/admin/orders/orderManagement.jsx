import { useState, useEffect, useCallback } from 'react';
import { Table, Tag, Select, Button, Modal, Input, message, Space, Pagination, Statistic, Image } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { getAdminOrdersApi, updateOrderStatusApi, formatPrice, getImageUrl } from '../../../util/api';

const STATUS_CONFIG = {
    pending:          { label: 'Đơn hàng mới',              color: 'blue' },
    confirmed:        { label: 'Đã xác nhận',               color: 'cyan' },
    preparing:        { label: 'Đang chuẩn bị',             color: 'purple' },
    shipping:         { label: 'Đang giao hàng',            color: 'orange' },
    delivered:        { label: 'Đã giao',                   color: 'green' },
    cancelled:        { label: 'Đã hủy',                    color: 'red' },
    cancel_requested: { label: 'Yêu cầu hủy',              color: 'volcano' },
};

const NEXT_STATUS = {
    pending:          [{ value: 'confirmed', label: 'Xác nhận đơn' }, { value: 'cancelled', label: 'Hủy đơn' }],
    confirmed:        [{ value: 'preparing', label: 'Bắt đầu chuẩn bị' }, { value: 'cancelled', label: 'Hủy đơn' }],
    preparing:        [{ value: 'shipping', label: 'Giao cho shipper' }],
    shipping:         [{ value: 'delivered', label: 'Xác nhận đã giao' }],
    cancel_requested: [{ value: 'cancelled', label: 'Duyệt hủy' }, { value: 'preparing', label: 'Từ chối hủy - Tiếp tục' }],
};

const MONTH_NAMES = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(undefined);
    const [orderCodeSearch, setOrderCodeSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const [detailModal, setDetailModal] = useState(false);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        const res = await getAdminOrdersApi({ page, limit: 20, status: statusFilter, orderCode: orderCodeSearch || undefined });
        if (res?.EC === 0) { setOrders(res.data.orders); setTotal(res.data.total); }
        setLoading(false);
    }, [page, statusFilter, orderCodeSearch]);

    useEffect(() => { loadOrders(); }, [loadOrders]);

    const openUpdateModal = (order, status) => {
        setSelectedOrder(order);
        setNewStatus(status);
        setNote('');
        setUpdateModal(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        const res = await updateOrderStatusApi(selectedOrder._id, newStatus, note);
        setUpdating(false);
        if (res?.EC === 0) {
            message.success('Đã cập nhật trạng thái');
            setUpdateModal(false);
            loadOrders();
        } else {
            message.error(res?.EM || 'Có lỗi xảy ra');
        }
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'orderCode',
            render: (code, record) => <code style={{ fontSize: '0.8rem' }}>{code || '#' + record._id.slice(-8).toUpperCase()}</code>,
            width: 150,
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            render: (user) => <span>{user?.fullName || user?.email || 'N/A'}</span>,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'shippingAddress',
            render: (addr) => <span className="text-gray-500" style={{ fontSize: '0.82rem' }}>{addr?.district}, {addr?.province}</span>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            render: (v) => <strong style={{ color: '#ff6b35' }}>{formatPrice(v)}</strong>,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            render: (d) => <span style={{ fontSize: '0.82rem' }}>{formatDate(d)}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (s) => {
                const cfg = STATUS_CONFIG[s] || { label: s, color: 'default' };
                return <Tag color={cfg.color}>{cfg.label}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            render: (_, record) => {
                const actions = NEXT_STATUS[record.status] || [];
                return (
                    <Space wrap>
                        <Button size="small" onClick={() => { setSelectedOrder(record); setDetailModal(true); }}>Chi tiết</Button>
                        {actions.map(a => (
                            <Button
                                key={a.value}
                                size="small"
                                type={a.value === 'cancelled' ? 'default' : 'primary'}
                                danger={a.value === 'cancelled'}
                                onClick={() => openUpdateModal(record, a.value)}
                            >
                                {a.label}
                            </Button>
                        ))}
                    </Space>
                );
            },
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h4 style={{ color: '#3a2e28', fontWeight: 600 }}>Quản lý đơn hàng</h4>
                <Space wrap>
                    <Input
                        placeholder="Tìm theo mã đơn..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200 }}
                        value={orderCodeSearch}
                        onChange={e => { setOrderCodeSearch(e.target.value); setPage(1); }}
                        allowClear
                    />
                    <Select
                        allowClear placeholder="Lọc trạng thái" style={{ width: 180 }}
                        value={statusFilter}
                        onChange={v => { setStatusFilter(v); setPage(1); }}
                    >
                        {Object.entries(STATUS_CONFIG).map(([key, { label, color }]) => (
                            <Select.Option key={key} value={key}><Tag color={color} style={{ margin: 0 }}>{label}</Tag></Select.Option>
                        ))}
                    </Select>
                </Space>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    loading={loading}
                    pagination={false}
                    scroll={{ x: 800 }}
                    size="small"
                />
                <div className="flex justify-end mt-3">
                    <Pagination current={page} total={total} pageSize={20} onChange={setPage} showSizeChanger={false} />
                </div>
            </div>

            {/* Modal cập nhật trạng thái */}
            <Modal
                title={`Cập nhật đơn #${selectedOrder?.orderCode || '#' + selectedOrder?._id?.slice(-8).toUpperCase()}`}
                open={updateModal}
                onOk={handleUpdate}
                onCancel={() => setUpdateModal(false)}
                okText="Xác nhận"
                cancelText="Hủy"
                confirmLoading={updating}
            >
                <p>Chuyển sang: <Tag color={STATUS_CONFIG[newStatus]?.color}>{STATUS_CONFIG[newStatus]?.label}</Tag></p>
                <Input.TextArea
                    rows={3}
                    placeholder="Ghi chú (tùy chọn)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
            </Modal>

            {/* Modal chi tiết đơn hàng */}
            <Modal
                title={`Chi tiết đơn ${selectedOrder?.orderCode || '#' + selectedOrder?._id?.slice(-8).toUpperCase()}`}
                open={detailModal}
                onCancel={() => setDetailModal(false)}
                footer={null}
                width={640}
            >
                {selectedOrder && (
                    <div>
                        {/* Status + Time */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div>
                                <strong>Trạng thái: </strong>
                                <Tag color={STATUS_CONFIG[selectedOrder.status]?.color}>{STATUS_CONFIG[selectedOrder.status]?.label}</Tag>
                            </div>
                            <span className="text-gray-500" style={{ fontSize: '0.83rem' }}>
                                Đặt lúc: {formatDate(selectedOrder.createdAt)}
                            </span>
                        </div>

                        {/* Customer */}
                        <div className="mb-3 p-3 rounded" style={{ background: '#f9f3ec' }}>
                            <strong>Khách hàng: </strong>{selectedOrder.user?.fullName || selectedOrder.user?.email}
                        </div>

                        {/* Shipping address */}
                        <div className="mb-3">
                            <strong>Địa chỉ giao hàng:</strong>
                            <div className="text-gray-500 mt-1" style={{ fontSize: '0.88rem' }}>
                                {selectedOrder.shippingAddress?.recipientName} • {selectedOrder.shippingAddress?.phone}<br />
                                {selectedOrder.shippingAddress?.detail}, {selectedOrder.shippingAddress?.ward},<br />
                                {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.province}
                            </div>
                        </div>

                        {/* Products with images */}
                        <div className="mb-3">
                            <strong>Sản phẩm:</strong>
                            {selectedOrder.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 mt-2 p-2 rounded" style={{ border: '1px solid #f0e8df' }}>
                                    <Image
                                        src={getImageUrl(item.image)}
                                        width={52}
                                        height={52}
                                        style={{ objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                                    />
                                    <div className="flex-1">
                                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.name}</div>
                                        <div className="text-gray-500" style={{ fontSize: '0.82rem' }}>
                                            {formatPrice(item.price)} × {item.quantity}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 600, color: '#ff6b35', whiteSpace: 'nowrap' }}>
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Price breakdown */}
                        <div className="p-3 rounded" style={{ background: '#f9f3ec', borderTop: '1px solid #e8ddd5' }}>
                            <div className="flex justify-between mb-1 text-gray-500" style={{ fontSize: '0.88rem' }}>
                                <span>Tạm tính</span>
                                <span>{formatPrice((selectedOrder.totalAmount || 0) - (selectedOrder.shippingFee || 0))}</span>
                            </div>
                            <div className="flex justify-between mb-2 text-gray-500" style={{ fontSize: '0.88rem' }}>
                                <span>Phí vận chuyển</span>
                                <span>{selectedOrder.shippingFee > 0 ? formatPrice(selectedOrder.shippingFee) : <span style={{ color: '#52c41a' }}>Miễn phí</span>}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Tổng cộng</span>
                                <span style={{ color: '#ff6b35', fontSize: '1.05rem' }}>{formatPrice(selectedOrder.totalAmount)}</span>
                            </div>
                        </div>

                        {selectedOrder.cancelReason && (
                            <div className="mt-3 p-3 rounded" style={{ background: '#fff5f5' }}>
                                <strong className="text-danger">Lý do hủy:</strong> {selectedOrder.cancelReason}
                            </div>
                        )}
                        {selectedOrder.notes && (
                            <div className="mt-3 p-3 rounded" style={{ background: '#f0f8ff' }}>
                                <strong>Ghi chú:</strong> {selectedOrder.notes}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default OrderManagement;
