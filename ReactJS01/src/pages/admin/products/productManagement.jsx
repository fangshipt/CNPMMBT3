import { useState, useEffect, useCallback } from "react";
import {
  Table, Button, Modal, Form, Input, InputNumber, Select,
  Switch, Space, Tag, Popconfirm, notification, Image, Tooltip,
  Badge, Upload,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined,
  EyeOutlined, EyeInvisibleOutlined, UploadOutlined, SearchOutlined,
} from "@ant-design/icons";
import {
  getProductsApi, getCategoriesApi,
  createProductApi, updateProductApi, deleteProductApi,
  uploadImagesApi,
} from "../../../util/api";
import { getImageUrl, formatPrice } from "../../../util/api";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [filterCategory, setFilterCategory] = useState(undefined);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page: currentPage, limit: 10, isActive: "all" };
    if (searchName.trim()) params.search = searchName.trim();
    if (filterCategory) params.category = filterCategory;
    getProductsApi(params).then((res) => {
      if (res.EC === 0) {
        setProducts(res.data);
        setTotalProducts(res.pagination?.totalProducts ?? 0);
      }
      setLoading(false);
    });
  }, [currentPage, searchName, filterCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategoriesApi({ limit: 100 }).then((res) => {
      if (res.EC === 0) setCategories(res.data);
    });
  }, []);

  const openAdd = () => {
    setEditingProduct(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({
      isActive: true, isBestSeller: false, isNewProduct: false,
      isFeatured: false, stock: 0, discountPrice: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    const initialFileList = (product.images || []).map((url, idx) => ({
      uid: `existing-${idx}`,
      name: `ảnh-${idx + 1}`,
      status: "done",
      url: getImageUrl(url),
      response: { url },
    }));
    setFileList(initialFileList);
    form.setFieldsValue({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      category: product.category?._id,
      isBestSeller: product.isBestSeller,
      isNewProduct: product.isNewProduct,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
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

      const images = fileList
        .filter((f) => f.status === "done")
        .map((f) => f.response?.url || f.url);

      const data = { ...values, images };

      const res = editingProduct
        ? await updateProductApi(editingProduct._id, data)
        : await createProductApi(data);

      if (res.EC === 0) {
        notification.success({
          message: editingProduct ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!",
        });
        setModalOpen(false);
        fetchProducts();
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
    const res = await deleteProductApi(id);
    if (res.EC === 0) {
      notification.success({ message: "Xoá sản phẩm thành công!" });
      fetchProducts();
    } else {
      notification.error({ message: res.EM });
    }
  };

  const handleToggleActive = async (product) => {
    const res = await updateProductApi(product._id, { isActive: !product.isActive });
    if (res.EC === 0) {
      notification.success({
        message: !product.isActive ? "Đã hiển thị sản phẩm" : "Đã ẩn sản phẩm",
      });
      fetchProducts();
    } else {
      notification.error({ message: res.EM });
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      width: 72,
      render: (images) => (
        <Image
          src={getImageUrl(images?.[0])}
          width={52}
          height={52}
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (name, r) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{name}</div>
          <small style={{ color: "#aaa" }}>{r.slug}</small>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      width: 130,
      render: (v) => (v ? <Tag color="blue">{v}</Tag> : "-"),
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      width: 120,
      render: (v) => formatPrice(v),
    },
    {
      title: "Giá bán",
      width: 140,
      render: (_, r) =>
        r.discountPrice > 0 ? (
          <div>
            <span style={{ color: "#e74c3c", fontWeight: 600 }}>{formatPrice(r.discountPrice)}</span>
            <div style={{ fontSize: "0.75rem", color: "#aaa", textDecoration: "line-through" }}>{formatPrice(r.price)}</div>
          </div>
        ) : (
          <span>{formatPrice(r.price)}</span>
        ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      width: 90,
      render: (v) => (
        <Badge
          count={v}
          showZero
          color={v > 0 ? "#52c41a" : "#ff4d4f"}
          style={{ fontWeight: 600 }}
        />
      ),
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      width: 100,
      render: (v) => <Tag color={v ? "green" : "default"}>{v ? "Hiển thị" : "Ẩn"}</Tag>,
    },
    {
      title: "Thao tác",
      width: 140,
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title={record.isActive ? "Ẩn" : "Hiển thị"}>
            <Button
              icon={record.isActive ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              size="small"
              onClick={() => handleToggleActive(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xoá sản phẩm này?"
            description="Hành động này không thể hoàn tác."
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

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 6, fontSize: "0.8rem" }}>Tải ảnh lên</div>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0" style={{ color: "#3a2e28", fontWeight: 700 }}>Quản lý sản phẩm</h4>
          <small style={{ color: "#8a7060" }}>Tổng: {totalProducts} sản phẩm</small>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchProducts} loading={loading}>
            Làm mới
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
            Thêm sản phẩm
          </Button>
        </Space>
      </div>

      {/* Filter bar */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Input
          placeholder="Tìm theo tên sản phẩm..."
          prefix={<SearchOutlined style={{ color: "#bbb" }} />}
          style={{ width: 260 }}
          value={searchName}
          onChange={(e) => { setSearchName(e.target.value); setCurrentPage(1); }}
          allowClear
        />
        <Select
          allowClear
          placeholder="Lọc theo danh mục"
          style={{ width: 200 }}
          value={filterCategory}
          onChange={(v) => { setFilterCategory(v); setCurrentPage(1); }}
          options={categories.map((c) => ({ value: c._id, label: c.name }))}
        />
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 0,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            total: totalProducts,
            pageSize: 10,
            onChange: (p) => setCurrentPage(p),
            showTotal: (total) => `Tổng ${total} sản phẩm`,
            showSizeChanger: false,
          }}
          scroll={{ x: 950 }}
          size="middle"
        />
      </div>

      <Modal
        title={
          <span style={{ fontSize: "1rem" }}>
            {editingProduct ? `Chỉnh sửa: ${editingProduct.name}` : "Thêm sản phẩm mới"}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        okText={editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
        cancelText="Huỷ"
        width={780}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div className="row g-3">
            <div className="col-md-8">
              <Form.Item
                label="Tên sản phẩm"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input placeholder="Nhập tên sản phẩm..." />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select
                  placeholder="Chọn danh mục"
                  options={categories.map((c) => ({ value: c._id, label: c.name }))}
                  showSearch
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <Form.Item
                label="Giá gốc (đ)"
                name="price"
                rules={[{ required: true, message: "Nhập giá" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="0"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => v.replace(/,/g, "")}
                />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item label="Giá khuyến mãi (đ)" name="discountPrice">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="0 = không giảm"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(v) => v.replace(/,/g, "")}
                />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item label="Tồn kho" name="stock">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="0" />
              </Form.Item>
            </div>
          </div>

          <Form.Item label="Mô tả sản phẩm" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả..." />
          </Form.Item>

          <Form.Item
            label="Ảnh sản phẩm"
            extra="Tối đa 5 ảnh. Định dạng: JPG, PNG, WEBP. Ảnh sẽ được lưu trên Cloudinary."
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={handleCustomUpload}
              onChange={({ fileList: newList }) => setFileList(newList)}
              accept="image/jpeg,image/png,image/webp"
              maxCount={5}
              multiple
            >
              {fileList.length < 5 && uploadButton}
            </Upload>
          </Form.Item>

          <div className="row g-2 mt-1">
            <div className="col-6 col-md-3">
              <Form.Item label="Bán chạy 🔥" name="isBestSeller" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div className="col-6 col-md-3">
              <Form.Item label="Hàng mới ✨" name="isNewProduct" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div className="col-6 col-md-3">
              <Form.Item label="Nổi bật ⭐" name="isFeatured" valuePropName="checked">
                <Switch />
              </Form.Item>
            </div>
            <div className="col-6 col-md-3">
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

export default ProductManagement;
