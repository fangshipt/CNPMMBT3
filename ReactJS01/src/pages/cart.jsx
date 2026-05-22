import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, InputNumber, Empty, Spin } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { CartContext } from '../components/context/cartContext';
import { AuthContext } from '../components/context/authContext';
import { formatPrice, getImageUrl } from '../util/api';

function CartPage() {
    const { cart, cartCount, cartTotal, loading, updateItem, removeItem } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!auth.isAuthenticated) {
        return (
            <div style={{ background: '#F9F3EC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-center">
                    <iconify-icon icon="ph:shopping-cart" style={{ fontSize: '4rem', color: '#ccc' }}></iconify-icon>
                    <p className="mt-3">Vui lòng <Link to="/login">đăng nhập</Link> để xem giỏ hàng</p>
                </div>
            </div>
        );
    }

    if (loading) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spin size="large" /></div>;

    const items = cart?.items || [];

    return (
        <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
            <div className="container py-5">
                <h2 className="mb-4 fw-normal" style={{ color: '#3a2e28' }}>
                    <iconify-icon icon="ph:shopping-cart" class="me-2"></iconify-icon>
                    Giỏ hàng của bạn
                    {cartCount > 0 && <span className="badge ms-2" style={{ background: '#ff6b35', fontSize: '1rem' }}>{cartCount}</span>}
                </h2>

                {items.length === 0 ? (
                    <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                        <Empty description="Giỏ hàng của bạn đang trống" />
                        <Link to="/products"><Button type="primary" className="mt-3" icon={<ShoppingOutlined />}>Tiếp tục mua sắm</Button></Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="bg-white rounded-4 shadow-sm p-4">
                                {items.map((item) => {
                                    const imgSrc = item.image ? getImageUrl(item.image) : '/assets/placeholder.png';
                                    const productId = item.product?._id || item.product;
                                    return (
                                        <div key={productId} className="d-flex gap-3 align-items-center py-3" style={{ borderBottom: '1px solid #f0e8df' }}>
                                            <img src={imgSrc} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold mb-1" style={{ color: '#3a2e28' }}>{item.name}</div>
                                                <div className="text-primary fw-bold">{formatPrice(item.price)}</div>
                                                {item.product?.stock !== undefined && (
                                                    <small className="text-muted">Còn {item.product.stock} sản phẩm</small>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <InputNumber
                                                    min={1}
                                                    max={item.product?.stock || 999}
                                                    value={item.quantity}
                                                    onChange={(val) => val && updateItem(productId, val)}
                                                    style={{ width: 70 }}
                                                    size="small"
                                                />
                                                <div className="fw-bold" style={{ minWidth: 90, textAlign: 'right', color: '#ff6b35' }}>
                                                    {formatPrice(item.price * item.quantity)}
                                                </div>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => removeItem(productId)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="bg-white rounded-4 shadow-sm p-4">
                                <h5 className="fw-semibold mb-3" style={{ color: '#3a2e28' }}>Tóm tắt đơn hàng</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tạm tính ({cartCount} sản phẩm)</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Phí vận chuyển</span>
                                    <span className="text-success">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <strong>Tổng cộng</strong>
                                    <strong className="text-primary fs-5">{formatPrice(cartTotal)}</strong>
                                </div>
                                <Button type="primary" block size="large" onClick={() => navigate('/checkout')}>
                                    Tiến hành thanh toán
                                </Button>
                                <Link to="/products">
                                    <Button block className="mt-2">Tiếp tục mua sắm</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CartPage;
