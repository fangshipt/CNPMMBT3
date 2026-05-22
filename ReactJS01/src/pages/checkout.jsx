import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, message, Spin, Tag } from 'antd';
import { PlusOutlined, CheckCircleFilled } from '@ant-design/icons';
import { CartContext } from '../components/context/cartContext';
import { AuthContext } from '../components/context/authContext';
import { getAddressesApi, createOrderApi, formatPrice, getImageUrl } from '../util/api';

function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, cartTotal, fetchCart } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);

    useEffect(() => {
        if (!auth.isAuthenticated) { navigate('/login'); return; }
        const loadData = async () => {
            const res = await getAddressesApi();
            if (res?.EC === 0) {
                setAddresses(res.data);
                const def = res.data.find(a => a.isDefault);
                if (def) setSelectedAddressId(def._id);
                else if (res.data.length === 0) navigate('/addresses?from=checkout');
            }
            setLoading(false);
        };
        loadData();
    }, [auth.isAuthenticated, navigate]);

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;

    const items = cart?.items || [];
    if (items.length === 0) {
        return (
            <div style={{ background: '#F9F3EC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <p>Giỏ hàng trống. <Link to="/products">Tiếp tục mua sắm</Link></p>
                </div>
            </div>
        );
    }

    const selectedAddress = addresses.find(a => a._id === selectedAddressId);
    const isHCM = selectedAddress?.province?.toLowerCase().includes('hồ chí minh') ||
                  selectedAddress?.province?.toLowerCase().includes('ho chi minh');
    const shippingFee = selectedAddress ? (isHCM ? 10000 : 30000) : 0;
    const orderTotal = cartTotal + shippingFee;

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) { message.warning('Vui lòng chọn địa chỉ giao hàng'); return; }
        setPlacing(true);
        const res = await createOrderApi({ addressId: selectedAddressId, shippingFee });
        setPlacing(false);
        if (res?.EC === 0) {
            await fetchCart();
            message.success('Đặt hàng thành công!');
            navigate(`/orders/${res.data._id}`);
        } else {
            message.error(res?.EM || 'Đặt hàng thất bại');
        }
    };

    return (
        <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
            <div className="container py-5">
                <h2 className="mb-4 fw-normal" style={{ color: '#3a2e28' }}>
                    <iconify-icon icon="ph:credit-card" class="me-2"></iconify-icon>
                    Thanh toán
                </h2>

                <div className="row g-4">
                    <div className="col-lg-7">
                        {/* Địa chỉ giao hàng */}
                        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-semibold m-0" style={{ color: '#3a2e28' }}>
                                    <iconify-icon icon="ph:map-pin" class="me-2"></iconify-icon>
                                    Địa chỉ giao hàng
                                </h5>
                                <Link to="/addresses">
                                    <Button size="small" icon={<PlusOutlined />}>Quản lý địa chỉ</Button>
                                </Link>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="text-center py-3">
                                    <p className="text-muted mb-2">Bạn chưa có địa chỉ nào.</p>
                                    <Link to="/addresses"><Button type="primary" icon={<PlusOutlined />}>Thêm địa chỉ ngay</Button></Link>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {addresses.map(addr => {
                                        const isSelected = selectedAddressId === addr._id;
                                        const fullAddress = [addr.detail, addr.ward, addr.district, addr.province].filter(Boolean).join(', ');
                                        return (
                                            <div
                                                key={addr._id}
                                                onClick={() => setSelectedAddressId(addr._id)}
                                                style={{
                                                    border: isSelected ? '2px solid #ff6b35' : '1.5px solid #e0d5ca',
                                                    borderRadius: 12,
                                                    padding: '14px 16px',
                                                    cursor: 'pointer',
                                                    background: isSelected ? '#FFF8F0' : '#fff',
                                                    transition: 'border-color 0.2s, background 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 12,
                                                }}
                                            >
                                                {/* Radio indicator */}
                                                <div style={{
                                                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                                                    border: isSelected ? '2px solid #ff6b35' : '2px solid #ccc',
                                                    background: isSelected ? '#ff6b35' : '#fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                                                </div>

                                                {/* Address content */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                                                        {addr.recipientName && (
                                                            <span style={{ fontWeight: 600, color: '#3a2e28', fontSize: '0.95rem' }}>{addr.recipientName}</span>
                                                        )}
                                                        {addr.phone && (
                                                            <span style={{ color: '#5a4a3f', fontSize: '0.9rem' }}>•</span>
                                                        )}
                                                        {addr.phone && (
                                                            <span style={{ color: '#5a4a3f', fontSize: '0.9rem' }}>{addr.phone}</span>
                                                        )}
                                                        {addr.isDefault && (
                                                            <Tag color="orange" style={{ fontSize: '0.72rem', margin: 0 }}>Mặc định</Tag>
                                                        )}
                                                    </div>
                                                    {fullAddress && (
                                                        <div style={{ color: '#6b7280', fontSize: '0.85rem', lineHeight: 1.5 }}>
                                                            <iconify-icon icon="ph:map-pin" style={{ fontSize: '0.85rem', marginRight: 4, verticalAlign: 'middle', color: '#ff6b35' }}></iconify-icon>
                                                            {fullAddress}
                                                        </div>
                                                    )}
                                                    {!addr.recipientName && !addr.phone && !fullAddress && (
                                                        <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Địa chỉ #{addr._id?.slice(-6)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="bg-white rounded-4 shadow-sm p-4">
                            <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>
                                <iconify-icon icon="ph:wallet" class="me-2"></iconify-icon>
                                Phương thức thanh toán
                            </h5>
                            <div className="p-3 rounded-3 d-flex align-items-center gap-3" style={{ border: '2px solid #ff6b35', background: '#FFF8F0' }}>
                                <CheckCircleFilled style={{ color: '#ff6b35', fontSize: '1.2rem' }} />
                                <div>
                                    <div className="fw-semibold">Thanh toán khi nhận hàng (COD)</div>
                                    <div className="text-muted small">Bạn chỉ thanh toán khi đã nhận được hàng</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="bg-white rounded-4 shadow-sm p-4">
                            <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Đơn hàng ({items.length} sản phẩm)</h5>
                            {items.map(item => {
                                const productId = item.product?._id || item.product;
                                return (
                                    <div key={productId} className="d-flex align-items-center gap-3 mb-3">
                                        <img src={item.image ? getImageUrl(item.image) : '/assets/placeholder.png'} alt={item.name}
                                            style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                        <div className="flex-grow-1">
                                            <div className="small fw-semibold" style={{ color: '#3a2e28' }}>{item.name}</div>
                                            <div className="text-muted small">x{item.quantity}</div>
                                        </div>
                                        <div className="fw-bold text-primary small">{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                );
                            })}
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính</span><span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Phí vận chuyển</span>
                                <span>
                                    {selectedAddress
                                        ? <span>{formatPrice(shippingFee)} <small className="text-muted">({isHCM ? 'Nội thành HCM' : 'Ngoại thành'})</small></span>
                                        : <span className="text-muted small">Chọn địa chỉ để tính phí</span>
                                    }
                                </span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <strong>Tổng thanh toán</strong>
                                <strong className="text-primary fs-5">{formatPrice(orderTotal)}</strong>
                            </div>
                            <Button type="primary" block size="large" onClick={handlePlaceOrder} loading={placing} disabled={!selectedAddressId}>
                                <iconify-icon icon="ph:check-circle" class="me-2"></iconify-icon>
                                Đặt hàng
                            </Button>
                            <Link to="/cart"><Button block className="mt-2">Quay lại giỏ hàng</Button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
