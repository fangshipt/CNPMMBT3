import { useContext, useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputNumber, Empty, Spin } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { CartContext } from '../components/context/cartContext';
import { AuthContext } from '../components/context/authContext';
import { formatPrice, getImageUrl, getActiveFreeshipApi } from '../util/api';

function CartPage() {
    const { cart, cartCount, loading, updateItem, removeItem } = useContext(CartContext);
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const items = cart?.items || [];
    const [selected, setSelected] = useState(() => new Set(items.map(i => i.product?._id || i.product)));
    const [freeshipProductIds, setFreeshipProductIds] = useState(new Set());
    const [hasFreeship, setHasFreeship] = useState(false);

    useEffect(() => {
        getActiveFreeshipApi().then(res => {
            if (res?.EC === 0) {
                setHasFreeship(res.data.hasFreeship);
                setFreeshipProductIds(new Set(res.data.productIds || []));
            }
        });
    }, []);

    const allChecked = items.length > 0 && items.every(i => selected.has(i.product?._id || i.product));
    const toggleAll = () => {
        if (allChecked) setSelected(new Set());
        else setSelected(new Set(items.map(i => i.product?._id || i.product)));
    };
    const toggleOne = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const { selectedCount, selectedTotal, selectedHasFreeship } = useMemo(() => {
        let count = 0, total = 0, hasFreeItem = false;
        items.forEach(item => {
            const id = (item.product?._id || item.product)?.toString();
            if (selected.has(item.product?._id || item.product)) {
                count += item.quantity;
                total += item.price * item.quantity;
                if (hasFreeship && freeshipProductIds.size > 0 && freeshipProductIds.has(id)) {
                    hasFreeItem = true;
                }
            }
        });
        return { selectedCount: count, selectedTotal: total, selectedHasFreeship: hasFreeItem };
    }, [items, selected, hasFreeship, freeshipProductIds]);

    if (!auth.isAuthenticated) {
        return (
            <div style={{ background: '#F9F3EC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <iconify-icon icon="ph:shopping-cart" style={{ fontSize: '4rem', color: '#ccc' }}></iconify-icon>
                    <p style={{ marginTop: 12 }}>Vui lòng <Link to="/login">đăng nhập</Link> để xem giỏ hàng</p>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spin size="large" />
        </div>
    );

    return (
        <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
            <div className="container py-5">
                <h2 style={{ color: '#3a2e28', fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <iconify-icon icon="ph:shopping-cart"></iconify-icon>
                    Giỏ hàng của bạn
                    {cartCount > 0 && (
                        <span style={{ background: '#ff6b35', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: '0.88rem', fontWeight: 600 }}>
                            {cartCount}
                        </span>
                    )}
                </h2>

                {items.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '48px 24px', textAlign: 'center' }}>
                        <Empty description="Giỏ hàng của bạn đang trống" />
                        <Link to="/products">
                            <button style={{ marginTop: 16, height: 42, padding: '0 28px', background: '#ff6b35', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <ShoppingOutlined /> Tiếp tục mua sắm
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="row g-4">
                        {/* Cart items */}
                        <div className="col-lg-8">
                            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                                {/* Select-all header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: '1px solid #f0e8df', background: '#faf6f2' }}>
                                    <input type="checkbox" checked={allChecked} onChange={toggleAll}
                                        style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#ff6b35' }} />
                                    <span style={{ fontSize: '0.88rem', color: '#5a4a3f', fontWeight: 500 }}>
                                        Chọn tất cả ({items.length} sản phẩm)
                                    </span>
                                </div>

                                {items.map((item) => {
                                    const productId = item.product?._id || item.product;
                                    const slug = item.product?.slug || productId;
                                    const imgSrc = item.image ? getImageUrl(item.image) : '/assets/placeholder.png';
                                    const isChecked = selected.has(productId);
                                    return (
                                        <div key={productId} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid #f0e8df' }}>
                                            {/* Checkbox */}
                                            <input type="checkbox" checked={isChecked} onChange={() => toggleOne(productId)}
                                                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#ff6b35', flexShrink: 0 }} />

                                            {/* Image */}
                                            <Link to={`/products/${slug}`} style={{ flexShrink: 0 }}>
                                                <img src={imgSrc} alt={item.name}
                                                    style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 10, display: 'block', border: '1px solid #f0e8df' }} />
                                            </Link>

                                            {/* Name + stock */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <Link to={`/products/${slug}`} style={{ textDecoration: 'none' }}>
                                                    <div style={{ fontWeight: 600, color: '#3a2e28', fontSize: '0.92rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {item.name}
                                                    </div>
                                                </Link>
                                                <div style={{ fontSize: '0.85rem', color: '#ff6b35', fontWeight: 700 }}>{formatPrice(item.price)}</div>
                                                {item.product?.stock !== undefined && (
                                                    <div style={{ fontSize: '0.78rem', color: '#aaa', marginTop: 2 }}>Còn {item.product.stock} sản phẩm</div>
                                                )}
                                            </div>

                                            {/* Qty */}
                                            <InputNumber
                                                min={1}
                                                max={item.product?.stock || 999}
                                                value={item.quantity}
                                                onChange={(val) => val && updateItem(productId, val)}
                                                style={{ width: 70, flexShrink: 0 }}
                                                size="small"
                                            />

                                            {/* Subtotal */}
                                            <div style={{ minWidth: 88, textAlign: 'right', fontWeight: 700, color: '#ff6b35', fontSize: '0.95rem', flexShrink: 0 }}>
                                                {formatPrice(item.price * item.quantity)}
                                            </div>

                                            {/* Delete */}
                                            <button
                                                onClick={() => removeItem(productId)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: '4px 6px', borderRadius: 6, flexShrink: 0, fontSize: '1rem', display: 'flex', alignItems: 'center' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                            >
                                                <DeleteOutlined />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="col-lg-4">
                            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', padding: '24px' }}>
                                <h5 style={{ color: '#3a2e28', fontWeight: 700, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #f0e8df' }}>
                                    Tóm tắt đơn hàng
                                </h5>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.9rem' }}>
                                    <span style={{ color: '#8a7060' }}>Tạm tính ({selectedCount} sản phẩm):</span>
                                    <span style={{ fontWeight: 600, color: '#3a2e28' }}>{formatPrice(selectedTotal)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.9rem' }}>
                                    <span style={{ color: '#8a7060' }}>Phí vận chuyển:</span>
                                    {selectedHasFreeship
                                        ? <span style={{ fontWeight: 700, color: '#16a34a' }}>Miễn phí 🚚</span>
                                        : <span style={{ fontWeight: 600, color: '#3a2e28' }}>{formatPrice(30000)}</span>
                                    }
                                </div>

                                <div style={{ borderTop: '1px solid #f0e8df', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                                    <span style={{ fontWeight: 700, color: '#3a2e28', fontSize: '1rem' }}>Tổng tiền:</span>
                                    <span style={{ fontWeight: 800, color: '#ff6b35', fontSize: '1.2rem' }}>
                                        {formatPrice(selectedTotal + (selectedHasFreeship ? 0 : 30000))}
                                    </span>
                                </div>

                                <button
                                    onClick={() => selected.size > 0 && navigate('/checkout')}
                                    disabled={selected.size === 0}
                                    style={{
                                        width: '100%', height: 46, background: selected.size > 0 ? '#ff6b35' : '#e0d5ca',
                                        color: '#fff', border: 'none', borderRadius: 12,
                                        fontSize: '0.95rem', fontWeight: 700, cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
                                        transition: 'background 0.2s', marginBottom: 10,
                                    }}
                                    onMouseEnter={e => selected.size > 0 && (e.currentTarget.style.background = '#e85d28')}
                                    onMouseLeave={e => e.currentTarget.style.background = selected.size > 0 ? '#ff6b35' : '#e0d5ca'}
                                >
                                    Tiến hành thanh toán
                                </button>

                                <Link to="/products" style={{ display: 'block', width: '100%' }}>
                                    <button style={{ width: '100%', height: 42, background: 'transparent', color: '#5a4a3f', border: '1.5px solid #e0d5ca', borderRadius: 12, fontSize: '0.88rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#f5ede7'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        Tiếp tục mua sắm
                                    </button>
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
