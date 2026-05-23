import { useState, useEffect } from 'react';
import { Select, Spin, Card, Statistic } from 'antd';
import { getRevenueApi, formatPrice } from '../../../util/api';

const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function RevenueManagement() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getRevenueApi(year).then(res => {
            if (res?.EC === 0) setData(res.data);
            setLoading(false);
        });
    }, [year]);

    const maxRevenue = data ? Math.max(...data.monthly.map(m => m.revenue), 1) : 1;

    const yearOptions = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) {
        yearOptions.push({ value: y, label: `Năm ${y}` });
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0" style={{ color: '#3a2e28', fontWeight: 700 }}>Quản lý doanh thu</h4>
                    <small style={{ color: '#8a7060' }}>Thống kê đơn hàng đã giao thành công</small>
                </div>
                <Select
                    value={year}
                    onChange={setYear}
                    options={yearOptions}
                    style={{ width: 130 }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
            ) : data && (
                <>
                    {/* Summary cards */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderLeft: '4px solid #52c41a' }}>
                                <div style={{ fontSize: '0.8rem', color: '#8a7060', marginBottom: 4 }}>Tổng doanh thu {year}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a2e28' }}>{formatPrice(data.totalRevenue)}</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderLeft: '4px solid #1890ff' }}>
                                <div style={{ fontSize: '0.8rem', color: '#8a7060', marginBottom: 4 }}>Đơn đã giao {year}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a2e28' }}>{data.totalOrders}</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderLeft: '4px solid #faad14' }}>
                                <div style={{ fontSize: '0.8rem', color: '#8a7060', marginBottom: 4 }}>Đơn đang xử lý</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a2e28' }}>{data.pendingCount}</div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', borderLeft: '4px solid #ff4d4f' }}>
                                <div style={{ fontSize: '0.8rem', color: '#8a7060', marginBottom: 4 }}>Đơn đã hủy {year}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a2e28' }}>{data.cancelledCount}</div>
                            </div>
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
                        <h6 style={{ color: '#3a2e28', fontWeight: 600, marginBottom: 20 }}>Doanh thu theo tháng — {year}</h6>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 220, paddingBottom: 8 }}>
                            {data.monthly.map(m => {
                                const heightPct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
                                const isCurrentMonth = m.month === new Date().getMonth() + 1 && year === currentYear;
                                return (
                                    <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                        {m.revenue > 0 && (
                                            <div style={{ fontSize: '0.62rem', color: '#8a7060', textAlign: 'center', lineHeight: 1.2 }}>
                                                {(m.revenue / 1e6).toFixed(1)}M
                                            </div>
                                        )}
                                        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: `${Math.max(heightPct, m.revenue > 0 ? 4 : 0)}%`,
                                                    background: isCurrentMonth
                                                        ? 'linear-gradient(to top, #ff6b35, #ffaa80)'
                                                        : m.revenue > 0
                                                            ? 'linear-gradient(to top, #DEAD6F, #f0d090)'
                                                            : '#f0e8df',
                                                    borderRadius: '6px 6px 0 0',
                                                    minHeight: 4,
                                                    transition: 'height 0.4s ease',
                                                    cursor: 'default',
                                                    position: 'relative',
                                                }}
                                                title={`${MONTH_LABELS[m.month - 1]}: ${formatPrice(m.revenue)} (${m.orders} đơn)`}
                                            />
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: isCurrentMonth ? '#ff6b35' : '#5a4a3f', fontWeight: isCurrentMonth ? 700 : 400 }}>
                                            {MONTH_LABELS[m.month - 1]}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly table */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '16px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', marginTop: 16 }}>
                        <h6 style={{ color: '#3a2e28', fontWeight: 600, marginBottom: 16 }}>Chi tiết theo tháng</h6>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f0e8df' }}>
                                        <th style={{ padding: '8px 12px', textAlign: 'left', color: '#5a4a3f', fontWeight: 600 }}>Tháng</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'right', color: '#5a4a3f', fontWeight: 600 }}>Số đơn</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'right', color: '#5a4a3f', fontWeight: 600 }}>Doanh thu</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'right', color: '#5a4a3f', fontWeight: 600 }}>TB/đơn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.monthly.map(m => (
                                        <tr key={m.month} style={{ borderBottom: '1px solid #f9f3ec' }}>
                                            <td style={{ padding: '8px 12px', color: '#3a2e28', fontWeight: 500 }}>{MONTH_LABELS[m.month - 1]}/{year}</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', color: m.orders > 0 ? '#1890ff' : '#ccc' }}>{m.orders}</td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', color: m.revenue > 0 ? '#52c41a' : '#ccc', fontWeight: m.revenue > 0 ? 600 : 400 }}>
                                                {m.revenue > 0 ? formatPrice(m.revenue) : '—'}
                                            </td>
                                            <td style={{ padding: '8px 12px', textAlign: 'right', color: '#8a7060' }}>
                                                {m.orders > 0 ? formatPrice(Math.round(m.revenue / m.orders)) : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr style={{ borderTop: '2px solid #f0e8df', background: '#faf6f0' }}>
                                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#3a2e28' }}>Tổng cộng</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#1890ff' }}>{data.totalOrders}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#52c41a' }}>{formatPrice(data.totalRevenue)}</td>
                                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#8a7060' }}>
                                            {data.totalOrders > 0 ? formatPrice(Math.round(data.totalRevenue / data.totalOrders)) : '—'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default RevenueManagement;
