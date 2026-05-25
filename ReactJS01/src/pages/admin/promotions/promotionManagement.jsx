import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Switch, DatePicker, Tag, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPromotionsApi, createPromotionApi, updatePromotionApi, deletePromotionApi, getProductsApi, getCategoriesApi, formatPrice, getImageUrl } from '../../../util/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

function PromotionManagement() {
    const [promotions, setPromotions] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [promoType, setPromoType] = useState('percent');
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        const [promoRes, prodRes, catRes] = await Promise.all([
            getPromotionsApi(),
            getProductsApi({ limit: 300, isActive: 'all' }),
            getCategoriesApi({ limit: 50 }),
        ]);
        if (promoRes?.EC === 0) setPromotions(promoRes.data);
        if (prodRes?.EC === 0) setProducts(prodRes.data);
        if (catRes?.EC === 0) setCategories(catRes.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const openAdd = () => {
        setEditing(null);
        setSelectedCategoryId(null);
        setPromoType('percent');
        form.resetFields();
        form.setFieldsValue({ isActive: true, type: 'percent' });
        setModalOpen(true);
    };

    const openEdit = (promo) => {
        setEditing(promo);
        setSelectedCategoryId(null);
        setPromoType(promo.type || 'percent');
        form.setFieldsValue({
            name: promo.name,
            description: promo.description,
            type: promo.type,
            value: promo.value,
            products: promo.products?.map(p => p._id || p),
            dateRange: promo.startDate && promo.endDate ? [dayjs(promo.startDate), dayjs(promo.endDate)] : undefined,
            isActive: promo.isActive,
        });
        setModalOpen(true);
    };

    const handleCategorySelect = (catId) => {
        setSelectedCategoryId(catId);
        if (!catId) return;
        const inCategory = products.filter(p => (p.category?._id || p.category) === catId).map(p => p._id);
        const current = form.getFieldValue('products') || [];
        const merged = [...new Set([...current, ...inCategory])];
        form.setFieldsValue({ products: merged });
    };

    const handleSubmit = async (values) => {
        setSaving(true);
        const payload = {
            name: values.name,
            description: values.description || '',
            type: values.type,
            value: values.value,
            products: values.products || [],
            startDate: values.dateRange?.[0]?.toISOString(),
            endDate: values.dateRange?.[1]?.toISOString(),
            isActive: values.isActive,
        };
        const res = editing
            ? await updatePromotionApi(editing._id, payload)
            : await createPromotionApi(payload);
        setSaving(false);
        if (res?.EC === 0) {
            message.success(editing ? 'Đã cập nhật khuyến mãi' : 'Đã tạo khuyến mãi');
            setModalOpen(false);
            loadData();
        } else {
            message.error(res?.EM || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        const res = await deletePromotionApi(id);
        if (res?.EC === 0) { message.success('Đã xóa khuyến mãi'); loadData(); }
        else message.error(res?.EM || 'Có lỗi xảy ra');
    };

    const columns = [
        {
            title: 'Tên khuyến mãi',
            dataIndex: 'name',
            render: (name, r) => (
                <div>
                    <div className="fw-semibold">{name}</div>
                    {r.description && <div className="text-muted small">{r.description}</div>}
                </div>
            ),
        },
        {
            title: 'Loại / Giá trị',
            render: (_, r) => {
                if (r.type === 'freeship') return <Tag color="cyan">Miễn phí vận chuyển</Tag>;
                if (r.type === 'percent') return <Tag color="blue">-{r.value}%</Tag>;
                return <Tag color="green">-{formatPrice(r.value)}</Tag>;
            },
            width: 160,
        },
        {
            title: 'Sản phẩm áp dụng',
            dataIndex: 'products',
            render: (prods) => <span className="text-muted small">{prods?.length || 0} sản phẩm</span>,
            width: 140,
        },
        {
            title: 'Thời gian',
            render: (_, r) => (
                <span className="small text-muted">
                    {r.startDate ? new Date(r.startDate).toLocaleDateString('vi-VN') : '—'} →{' '}
                    {r.endDate ? new Date(r.endDate).toLocaleDateString('vi-VN') : '—'}
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render: (v) => <Tag color={v ? 'green' : 'default'}>{v ? 'Đang chạy' : 'Tắt'}</Tag>,
            width: 110,
        },
        {
            title: 'Thao tác',
            render: (_, r) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                    <Popconfirm title="Xóa khuyến mãi này sẽ reset giá gốc các sản phẩm. Tiếp tục?" onConfirm={() => handleDelete(r._id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
            width: 100,
        },
    ];

    const productOptions = products.map(p => ({
        value: p._id,
        label: p.name,
        image: p.images?.[0],
        price: p.price,
    }));

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#3a2e28', fontWeight: 600 }}>Quản lý khuyến mãi</h4>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Tạo khuyến mãi</Button>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
                <Table
                    columns={columns}
                    dataSource={promotions}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    size="small"
                />
            </div>

            <Modal
                title={editing ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={720}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true, message: 'Nhập tên khuyến mãi' }]}>
                        <Input placeholder="VD: Sale hè 2025" />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả (tùy chọn)">
                        <Input placeholder="Mô tả ngắn về chương trình..." />
                    </Form.Item>

                    <div className="row g-0">
                        <div className={promoType === 'freeship' ? 'col-12' : 'col-md-5 pe-md-2'}>
                            <Form.Item name="type" label="Loại khuyến mãi" rules={[{ required: true }]}>
                                <Select onChange={(v) => setPromoType(v)}>
                                    <Select.Option value="percent">Giảm theo % (phần trăm)</Select.Option>
                                    <Select.Option value="fixed">Giảm tiền cố định (đồng)</Select.Option>
                                    <Select.Option value="freeship">Miễn phí vận chuyển</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>
                        {promoType !== 'freeship' && (
                            <div className="col-md-7 ps-md-2">
                                <Form.Item name="value" label="Giá trị giảm" rules={[{ required: true, message: 'Nhập giá trị giảm' }]}>
                                    <InputNumber
                                        min={0} style={{ width: '100%' }}
                                        placeholder="VD: 20 (%) hoặc 50000 (đồng)"
                                    />
                                </Form.Item>
                            </div>
                        )}
                    </div>
                    {promoType === 'freeship' && (
                        <div className="mb-3 p-3 rounded-3" style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                            <span style={{ color: '#0958d9', fontSize: '0.875rem' }}>
                                🚚 Khách hàng sẽ được miễn phí vận chuyển hoàn toàn, bất kể địa chỉ nội thành hay ngoại thành.
                            </span>
                        </div>
                    )}

                    {/* Category quick-select */}
                    <Form.Item label="Chọn theo danh mục (thêm nhanh vào danh sách sản phẩm)">
                        <Select
                            allowClear
                            placeholder="Chọn danh mục để thêm tất cả sản phẩm..."
                            value={selectedCategoryId}
                            onChange={handleCategorySelect}
                            options={categories.map(c => ({ value: c._id, label: c.name }))}
                        />
                    </Form.Item>

                    <Form.Item name="products" label="Sản phẩm áp dụng">
                        <Select
                            mode="multiple"
                            showSearch
                            placeholder="Tìm và chọn sản phẩm..."
                            filterOption={(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase())}
                            maxTagCount={4}
                            optionRender={(option) => {
                                const prod = productOptions.find(p => p.value === option.value);
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {prod?.image ? (
                                            <img src={getImageUrl(prod.image)} alt="" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                                        ) : (
                                            <div style={{ width: 32, height: 32, background: '#f0e8df', borderRadius: 4, flexShrink: 0 }} />
                                        )}
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{prod?.label}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#a0856e' }}>{prod ? formatPrice(prod.price) : ''}</div>
                                        </div>
                                    </div>
                                );
                            }}
                            options={productOptions.map(p => ({ value: p.value, label: p.label }))}
                        />
                    </Form.Item>

                    <Form.Item name="dateRange" label="Thời gian chạy (tùy chọn)">
                        <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item name="isActive" label="Trạng thái" valuePropName="checked">
                        <Switch checkedChildren="Đang chạy" unCheckedChildren="Tắt" />
                    </Form.Item>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button onClick={() => setModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={saving}>Lưu khuyến mãi</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default PromotionManagement;
