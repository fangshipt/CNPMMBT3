import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, Select, Switch, Tag, message, Empty, Popconfirm, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { getAddressesApi, createAddressApi, updateAddressApi, deleteAddressApi, setDefaultAddressApi } from '../util/api';

const { Option } = Select;
const PROVINCES_API = 'https://provinces.open-api.vn/api';

function AddressesPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fromCheckout = searchParams.get('from') === 'checkout';

    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    const loadAddresses = useCallback(async () => {
        setLoading(true);
        const res = await getAddressesApi();
        if (res?.EC === 0) setAddresses(res.data);
        setLoading(false);
    }, []);

    useEffect(() => { loadAddresses(); }, [loadAddresses]);

    useEffect(() => {
        setLoadingProvinces(true);
        fetch(`${PROVINCES_API}/?depth=1`)
            .then(r => r.json())
            .then(data => setProvinces(data))
            .catch(() => message.error('Không thể tải danh sách tỉnh/thành'))
            .finally(() => setLoadingProvinces(false));
    }, []);

    const handleProvinceChange = async (provinceCode) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        setDistricts([]);
        setWards([]);
        if (!provinceCode) return;
        setLoadingDistricts(true);
        try {
            const res = await fetch(`${PROVINCES_API}/p/${provinceCode}?depth=2`);
            const data = await res.json();
            setDistricts(data.districts || []);
        } catch {
            message.error('Không thể tải danh sách quận/huyện');
        } finally {
            setLoadingDistricts(false);
        }
    };

    const handleDistrictChange = async (districtCode) => {
        form.setFieldsValue({ ward: undefined });
        setWards([]);
        if (!districtCode) return;
        setLoadingWards(true);
        try {
            const res = await fetch(`${PROVINCES_API}/d/${districtCode}?depth=2`);
            const data = await res.json();
            setWards(data.wards || []);
        } catch {
            message.error('Không thể tải danh sách phường/xã');
        } finally {
            setLoadingWards(false);
        }
    };

    const openAdd = () => {
        setEditing(null);
        setDistricts([]);
        setWards([]);
        form.resetFields();
        setModalOpen(true);
    };

    const openEdit = async (addr) => {
        setEditing(addr);
        setDistricts([]);
        setWards([]);
        form.resetFields();

        // Tìm province code từ tên
        const province = provinces.find(p => p.name === addr.province);
        if (province) {
            try {
                setLoadingDistricts(true);
                const res = await fetch(`${PROVINCES_API}/p/${province.code}?depth=2`);
                const data = await res.json();
                const districtList = data.districts || [];
                setDistricts(districtList);
                setLoadingDistricts(false);

                const district = districtList.find(d => d.name === addr.district);
                if (district) {
                    setLoadingWards(true);
                    const res2 = await fetch(`${PROVINCES_API}/d/${district.code}?depth=2`);
                    const data2 = await res2.json();
                    const wardList = data2.wards || [];
                    setWards(wardList);
                    setLoadingWards(false);

                    const ward = wardList.find(w => w.name === addr.ward);
                    form.setFieldsValue({
                        recipientName: addr.recipientName,
                        phone: addr.phone,
                        province: province.code,
                        district: district.code,
                        ward: ward?.code,
                        detail: addr.detail,
                        isDefault: addr.isDefault,
                    });
                } else {
                    form.setFieldsValue({
                        recipientName: addr.recipientName,
                        phone: addr.phone,
                        province: province.code,
                        detail: addr.detail,
                        isDefault: addr.isDefault,
                    });
                }
            } catch {
                form.setFieldsValue({
                    recipientName: addr.recipientName,
                    phone: addr.phone,
                    detail: addr.detail,
                    isDefault: addr.isDefault,
                });
            }
        } else {
            form.setFieldsValue({
                recipientName: addr.recipientName,
                phone: addr.phone,
                detail: addr.detail,
                isDefault: addr.isDefault,
            });
        }
        setModalOpen(true);
    };

    const handleSubmit = async (values) => {
        const province = provinces.find(p => p.code === values.province);
        const district = districts.find(d => d.code === values.district);
        const ward = wards.find(w => w.code === values.ward);

        const payload = {
            recipientName: values.recipientName,
            phone: values.phone,
            province: province?.name || values.province,
            district: district?.name || values.district,
            ward: ward?.name || values.ward,
            detail: values.detail,
            isDefault: values.isDefault || false,
        };

        const res = editing
            ? await updateAddressApi(editing._id, payload)
            : await createAddressApi(payload);

        if (res?.EC === 0) {
            message.success(editing ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ mới');
            setModalOpen(false);
            await loadAddresses();
            // Nếu từ checkout → quay lại checkout sau khi thêm địa chỉ mới
            if (!editing && fromCheckout) navigate('/checkout');
        } else {
            message.error(res?.EM || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        const res = await deleteAddressApi(id);
        if (res?.EC === 0) { message.success('Đã xóa địa chỉ'); loadAddresses(); }
        else message.error(res?.EM || 'Có lỗi xảy ra');
    };

    const handleSetDefault = async (id) => {
        const res = await setDefaultAddressApi(id);
        if (res?.EC === 0) { message.success('Đã đặt làm địa chỉ mặc định'); loadAddresses(); }
        else message.error(res?.EM);
    };

    return (
        <div style={{ background: '#F9F3EC', minHeight: '100vh' }}>
            <div className="container py-5">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="font-normal m-0" style={{ color: '#3a2e28' }}>
                            <iconify-icon icon="ph:map-pin" class="mr-2"></iconify-icon>
                            Danh sách địa chỉ
                        </h2>
                        {fromCheckout && (
                            <p className="text-gray-500 small mt-1 mb-0">
                                <iconify-icon icon="ph:info" class="mr-1"></iconify-icon>
                                Thêm địa chỉ để tiếp tục thanh toán
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {fromCheckout && (
                            <Button onClick={() => navigate('/checkout')}>← Quay lại thanh toán</Button>
                        )}
                        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm địa chỉ mới</Button>
                    </div>
                </div>

                {!loading && addresses.length === 0 && (
                    <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                        <Empty description="Bạn chưa có địa chỉ nào" />
                        <Button type="primary" className="mt-3" icon={<PlusOutlined />} onClick={openAdd}>Thêm địa chỉ</Button>
                    </div>
                )}

                <div className="row g-3">
                    {addresses.map((addr) => (
                        <div key={addr._id} className="col-md-6">
                            <div className="bg-white rounded-4 shadow-sm p-4 h-full" style={{ border: addr.isDefault ? '2px solid #f97316' : '1px solid #f0e8df' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <strong style={{ color: '#3a2e28' }}>{addr.recipientName}</strong>
                                        {addr.isDefault && <Tag color="orange" className="ml-2">Mặc định</Tag>}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(addr)} />
                                        <Popconfirm title="Xóa địa chỉ này?" onConfirm={() => handleDelete(addr._id)} okText="Xóa" cancelText="Hủy">
                                            <Button size="small" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>
                                    </div>
                                </div>
                                <div className="text-gray-500 small mb-1">{addr.phone}</div>
                                <div className="text-gray-500 small">
                                    {addr.detail}, {addr.ward}, {addr.district}, {addr.province}
                                </div>
                                {!addr.isDefault && (
                                    <Button size="small" className="mt-2" icon={<HomeOutlined />} onClick={() => handleSetDefault(addr._id)}>
                                        Đặt làm mặc định
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                title={editing ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div className="row g-0">
                        <div className="col-md-6 pe-md-2">
                            <Form.Item name="recipientName" label="Họ tên người nhận" rules={[{ required: true, message: 'Nhập tên người nhận' }]}>
                                <Input placeholder="Nguyễn Văn A" />
                            </Form.Item>
                        </div>
                        <div className="col-md-6 ps-md-2">
                            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
                                <Input placeholder="0901234567" />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item name="province" label="Tỉnh / Thành phố" rules={[{ required: true, message: 'Chọn tỉnh/thành phố' }]}>
                        <Select
                            showSearch
                            placeholder={loadingProvinces ? 'Đang tải...' : 'Chọn tỉnh/thành phố'}
                            onChange={handleProvinceChange}
                            disabled={loadingProvinces}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            suffixIcon={loadingProvinces ? <Spin size="small" /> : undefined}
                        >
                            {provinces.map(p => <Option key={p.code} value={p.code}>{p.name}</Option>)}
                        </Select>
                    </Form.Item>

                    <div className="row g-0">
                        <div className="col-md-6 pe-md-2">
                            <Form.Item name="district" label="Quận / Huyện" rules={[{ required: true, message: 'Chọn quận/huyện' }]}>
                                <Select
                                    showSearch
                                    placeholder={loadingDistricts ? 'Đang tải...' : 'Chọn quận/huyện'}
                                    onChange={handleDistrictChange}
                                    disabled={!districts.length || loadingDistricts}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    suffixIcon={loadingDistricts ? <Spin size="small" /> : undefined}
                                >
                                    {districts.map(d => <Option key={d.code} value={d.code}>{d.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="col-md-6 ps-md-2">
                            <Form.Item name="ward" label="Phường / Xã" rules={[{ required: true, message: 'Chọn phường/xã' }]}>
                                <Select
                                    showSearch
                                    placeholder={loadingWards ? 'Đang tải...' : 'Chọn phường/xã'}
                                    disabled={!wards.length || loadingWards}
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    suffixIcon={loadingWards ? <Spin size="small" /> : undefined}
                                >
                                    {wards.map(w => <Option key={w.code} value={w.code}>{w.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item name="detail" label="Địa chỉ cụ thể (số nhà, tên đường)" rules={[{ required: true, message: 'Nhập địa chỉ cụ thể' }]}>
                        <Input placeholder="Ví dụ: 123 Nguyễn Huệ" />
                    </Form.Item>

                    <Form.Item name="isDefault" valuePropName="checked">
                        <Switch checkedChildren="Mặc định" unCheckedChildren="Mặc định" />
                        <span className="ml-2 text-gray-500 small">Đặt làm địa chỉ mặc định</span>
                    </Form.Item>

                    <div className="flex gap-2 justify-end">
                        <Button onClick={() => setModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit">Lưu địa chỉ</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default AddressesPage;
