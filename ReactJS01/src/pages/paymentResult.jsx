import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from 'antd';

function PaymentResultPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const code = searchParams.get('code');
        const cancel = searchParams.get('cancel');
        if (cancel === 'true' || code === 'CANCELLED') {
            setStatus('cancelled');
        } else if (code === '00') {
            setStatus('success');
        } else {
            setStatus('failed');
        }
    }, [searchParams]);

    const config = {
        success: {
            icon: 'ph:check-circle',
            color: '#52c41a',
            title: 'Thanh toán thành công!',
            desc: 'Đơn hàng của bạn đã được thanh toán. Chúng tôi sẽ xử lý và giao hàng sớm nhất có thể.',
        },
        cancelled: {
            icon: 'ph:x-circle',
            color: '#faad14',
            title: 'Thanh toán đã hủy',
            desc: 'Bạn đã hủy giao dịch thanh toán. Đơn hàng vẫn được lưu với trạng thái chờ thanh toán.',
        },
        failed: {
            icon: 'ph:warning-circle',
            color: '#ff4d4f',
            title: 'Thanh toán thất bại',
            desc: 'Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.',
        },
        loading: {
            icon: 'ph:spinner-gap',
            color: '#1890ff',
            title: 'Đang xử lý...',
            desc: '',
        },
    };

    const cfg = config[status];

    return (
        <div style={{ background: '#F9F3EC', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center" style={{ maxWidth: 440, padding: '40px 24px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <iconify-icon
                    icon={cfg.icon}
                    style={{ fontSize: '4rem', color: cfg.color, display: 'block', marginBottom: 16 }}
                ></iconify-icon>
                <h3 style={{ color: '#3a2e28', fontWeight: 700, marginBottom: 8 }}>{cfg.title}</h3>
                <p className="text-muted" style={{ marginBottom: 28 }}>{cfg.desc}</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/orders">
                        <Button type="primary" size="large">Xem đơn hàng của tôi</Button>
                    </Link>
                    <Link to="/products">
                        <Button size="large">Tiếp tục mua sắm</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PaymentResultPage;
