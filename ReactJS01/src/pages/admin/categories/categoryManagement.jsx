import { useState, useEffect, useCallback } from "react";
import {
  Table, Button, Modal, Form, Input, InputNumber, Switch,
  Space, Tag, Popconfirm, notification, Tooltip, Upload, Image,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined,
} from "@ant-design/icons";
import {
  getCategoriesApi, createCategoryApi, updateCategoryApi, deleteCategoryApi,
  uploadImagesApi,
} from "../../../util/api";
import { getImageUrl } from "../../../util/api";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const fetchCategories = useCallback(() => {
    setLoading(true);
    getCategoriesApi({ page: currentPage, limit: 10 }).then((res) => {
      if (res.EC === 0) {
        setCategories(res.data);
        setTotal(res.pagination?.total ?? 0);
      }
      setLoading(false);
    });
  }, [currentPage]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openAdd = () => {
    setEditingCategory(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({ isActive: true, sortOrder: 0 });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    const initialFileList = cat.image
      ? [{ uid: "existing-0", name: "ảnh-danh-mục", status: "done", url: getImageUrl(cat.image), response: { url: cat.image } }]
      : [];
    setFileList(initialFileList);
    form.setFieldsValue({
      name: cat.name,
      description: cat.description,
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setModalOpen(true);
  };

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append("images", file);
    try {
      const res = await uploadImagesApi(formData);
      if (res.EC === 0) {
        onSuccess({ url: res.data[0] });
      } else {
        onError(new Error(res.EM || "Upload thất bại"));
        notification.error({ message: res.EM || "Upload ảnh thất bại" });
      }
    } catch (err) {
      onError(err);
      notification.error({ message: "Lỗi khi upload ảnh" });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const uploading = fileList.some((f) => f.status === "uploading");
      if (uploading) {
        notification.warning({ message: "Vui lòng chờ ảnh tải lên xong" });
        setSubmitting(false);
        return;
      }

      const doneFile = fileList.find((f) => f.status === "done");
      const image = doneFile?.response?.url || doneFile?.url || "";

      const res = editingCategory
        ? await updateCategoryApi(editingCategory._id, { ...values, image })
        : await createCategoryApi({ ...values, image });

      if (res.EC === 0) {
        notification.success({
          message: editingCategory ? "Cập nhật thành công!" : "Thêm danh mục thành công!",
        });
        setModalOpen(false);
        fetchCategories();
      } else {
        notification.error({ message: res.EM });
      }
    } catch {
      // form validation errors
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteCategoryApi(id);
    if (res.EC === 0) {
      notification.success({ message: "Xoá danh mục thành công!" });
      fetchCategories();
    } else {
      notification.error({ message: res.EM || "Không thể xoá danh mục này" });
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 72,
      render: (image) =>
        image ? (
          <Image
            src={getImageUrl(image)}
            width={52}
            height={52}
            style={{ objectFit: "cover", borderRadius: 8 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
          />
        ) : (
          <div
            style={{
              width: 52, height: 52, background: "#f0f0f0",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#ccc", fontSize: "1.2rem",
            }}
          >
            🏷️
          </div>
        ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{name}</div>
          <small style={{ color: "#aaa" }}>{r.slug}</small>
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (v) => v || <span style={{ color: "#ccc" }}>—</span>,
    },
    {
      title: "Thứ tự",
      dataIndex: "sortOrder",
      width: 90,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 110,
      render: (v) => <Tag color={v ? "green" : "default"}>{v ? "Hiển thị" : "Ẩn"}</Tag>,
    },
    {
      title: "Thao tác",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm
            title="Xoá danh mục này?"
            description="Không thể xoá nếu danh mục còn sản phẩm."
            onConfirm={() => handleDelete(record._id)}
            okText="Xoá"
            cancelText="Huỷ"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xoá">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h4 className="mb-0" style={{ color: "#3a2e28", fontWeight: 700 }}>Quản lý danh mục</h4>
          <small style={{ color: "#8a7060" }}>Tổng: {total} danh mục</small>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchCategories} loading={loading}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm danh mục
          </Button>
        </Space>
      </div>

      <div
        style={{
          background: "#fff", borderRadius: 12,
          overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            total,
            pageSize: 10,
            onChange: (p) => setCurrentPage(p),
            showTotal: (t) => `Tổng ${t} danh mục`,
            showSizeChanger: false,
          }}
          size="middle"
        />
      </div>

      <Modal
        title={
          <span style={{ fontSize: "1rem" }}>
            {editingCategory ? `Chỉnh sửa: ${editingCategory.name}` : "Thêm danh mục mới"}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        okText={editingCategory ? "Lưu thay đổi" : "Thêm danh mục"}
        cancelText="Huỷ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
          >
            <Input placeholder="Nhập tên danh mục..." />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} placeholder="Mô tả ngắn..." />
          </Form.Item>

          <Form.Item
            label="Ảnh đại diện danh mục"
            extra="Định dạng: JPG, PNG, WEBP. Ảnh sẽ được lưu trên Cloudinary."
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={handleCustomUpload}
              onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
              accept="image/jpeg,image/png,image/webp"
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 6, fontSize: "0.8rem" }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="row g-3">
            <div className="col-md-6">
              <Form.Item label="Thứ tự hiển thị" name="sortOrder">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item label="Hiển thị" name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default CategoryManagement;
