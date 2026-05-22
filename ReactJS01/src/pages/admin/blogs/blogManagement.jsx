import { useState, useEffect, useContext } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Tag, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAdminBlogsApi, createBlogApi, updateBlogApi, deleteBlogApi, uploadImagesApi, getImageUrl } from '../../../util/api';
import { AuthContext } from '../../../components/context/authContext';

const { TextArea } = Input;

function BlogManagement() {
    const { auth } = useContext(AuthContext);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        const res = await getAdminBlogsApi({ limit: 50 });
        if (res?.EC === 0) setBlogs(res.data);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const openAdd = () => {
        setEditing(null);
        setPreviewImage('');
        form.resetFields();
        form.setFieldsValue({ isPublished: false });
        setModalOpen(true);
    };

    const openEdit = (blog) => {
        setEditing(blog);
        setPreviewImage(blog.image ? getImageUrl(blog.image) : '');
        form.setFieldsValue({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            isPublished: blog.isPublished,
        });
        setModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageUploading(true);
        const formData = new FormData();
        formData.append('images', file);
        const res = await uploadImagesApi(formData);
        setImageUploading(false);
        if (res?.EC === 0 && res.data?.[0]) {
            const imgPath = res.data[0];
            form.setFieldsValue({ image: imgPath });
            setPreviewImage(getImageUrl(imgPath));
        } else {
            message.error('Tải ảnh thất bại');
        }
    };

    const handleSubmit = async (values) => {
        setSaving(true);
        const payload = { ...values };
        const res = editing
            ? await updateBlogApi(editing._id, payload)
            : await createBlogApi(payload);
        setSaving(false);
        if (res?.EC === 0) {
            message.success(editing ? 'Đã cập nhật bài viết' : 'Đã tạo bài viết');
            setModalOpen(false);
            loadData();
        } else {
            message.error(res?.EM || 'Có lỗi xảy ra');
        }
    };

    const handleDelete = async (id) => {
        const res = await deleteBlogApi(id);
        if (res?.EC === 0) { message.success('Đã xóa bài viết'); loadData(); }
        else message.error(res?.EM || 'Có lỗi xảy ra');
    };

    const columns = [
        {
            title: 'Ảnh',
            dataIndex: 'image',
            render: (img) => img ? (
                <img src={getImageUrl(img)} alt="" style={{ width: 60, height: 45, objectFit: 'cover', borderRadius: 6 }} />
            ) : <div style={{ width: 60, height: 45, background: '#f0e8df', borderRadius: 6 }} />,
            width: 80,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            render: (title, r) => (
                <div>
                    <div className="fw-semibold">{title}</div>
                    <div className="text-muted small">{r.slug}</div>
                </div>
            ),
        },
        {
            title: 'Mô tả ngắn',
            dataIndex: 'excerpt',
            render: (t) => <span className="text-muted small">{t?.slice(0, 80)}{t?.length > 80 ? '...' : ''}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isPublished',
            render: (v, r) => (
                <div>
                    <Tag color={v ? 'green' : 'default'}>{v ? 'Đã đăng' : 'Nháp'}</Tag>
                    {v && r.publishedAt && <div className="text-muted small">{new Date(r.publishedAt).toLocaleDateString('vi-VN')}</div>}
                </div>
            ),
            width: 120,
        },
        {
            title: 'Thao tác',
            render: (_, r) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)} />
                    <Popconfirm title="Xóa bài viết này?" onConfirm={() => handleDelete(r._id)} okText="Xóa" cancelText="Hủy">
                        <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
            width: 100,
        },
    ];

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 style={{ color: '#3a2e28', fontWeight: 600 }}>Quản lý bài viết</h4>
                <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Tạo bài viết</Button>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
                <Table
                    columns={columns}
                    dataSource={blogs}
                    rowKey="_id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    size="small"
                />
            </div>

            <Modal
                title={editing ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={760}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                        <Input
                            placeholder="Tiêu đề bài viết"
                            onChange={(e) => {
                                if (!editing) {
                                    const slug = e.target.value.toLowerCase()
                                        .normalize('NFD').replace(/[̀-ͯ]/g, '')
                                        .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
                                        .trim().replace(/\s+/g, '-');
                                    form.setFieldsValue({ slug });
                                }
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="slug" label="Slug (URL)" rules={[{ required: true, message: 'Nhập slug' }]}>
                        <Input placeholder="ten-bai-viet" />
                    </Form.Item>

                    <Form.Item label="Ảnh bìa">
                        <div className="d-flex gap-3 align-items-start">
                            {previewImage && (
                                <img src={previewImage} alt="preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                            )}
                            <div>
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} id="blog-img-upload" />
                                <Button loading={imageUploading} onClick={() => document.getElementById('blog-img-upload').click()}>
                                    {previewImage ? 'Đổi ảnh' : 'Chọn ảnh'}
                                </Button>
                            </div>
                        </div>
                        <Form.Item name="image" noStyle><Input type="hidden" /></Form.Item>
                    </Form.Item>

                    <Form.Item name="excerpt" label="Mô tả ngắn">
                        <TextArea rows={2} placeholder="Tóm tắt bài viết (hiển thị ở trang chủ)..." />
                    </Form.Item>

                    <Form.Item name="content" label="Nội dung">
                        <TextArea rows={8} placeholder="Nội dung bài viết..." />
                    </Form.Item>

                    <Form.Item name="isPublished" label="Trạng thái" valuePropName="checked">
                        <Switch checkedChildren="Đã đăng" unCheckedChildren="Nháp" />
                    </Form.Item>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button onClick={() => setModalOpen(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={saving}>Lưu bài viết</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default BlogManagement;
