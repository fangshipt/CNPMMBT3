import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, message, Avatar, Tabs, Spin } from "antd";
import { UserOutlined, LockOutlined, CameraOutlined } from "@ant-design/icons";
import { updateUserSuccess } from "../store/authSlice";
import { updateProfileApi, changePasswordApi, updateAvatarApi } from "../util/api";
import axios from "../util/axios.customize";

const AccountPage = () => {
    const dispatch = useDispatch();
    const user     = useSelector((state) => state.auth.user);
    const [profileLoading, setProfileLoading] = useState(false);
    const [pwdLoading, setPwdLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");
    const fileRef = useRef(null);

    const handleUpdateProfile = async (values) => {
        setProfileLoading(true);
        const res = await updateProfileApi({ fullName: values.fullName, phone: values.phone }).catch(() => null);
        setProfileLoading(false);
        if (res?.EC === 0) {
            message.success("Cập nhật thông tin thành công!");
            dispatch(updateUserSuccess({ name: values.fullName, fullName: values.fullName, phone: values.phone }));
        } else {
            message.error(res?.EM || "Cập nhật thất bại");
        }
    };

    const handleChangePassword = async (values) => {
        setPwdLoading(true);
        const res = await changePasswordApi({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
        }).catch(() => null);
        setPwdLoading(false);
        if (res?.EC === 0) {
            message.success("Đổi mật khẩu thành công!");
        } else {
            message.error(res?.EM || "Đổi mật khẩu thất bại");
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            message.error("Vui lòng chọn file ảnh");
            return;
        }
        setAvatarLoading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);
            const uploadRes = await axios.post("/api/upload/product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const url = uploadRes?.data?.url || uploadRes?.url;
            if (!url) throw new Error("Upload thất bại");

            const res = await updateAvatarApi({ avatar: url });
            if (res?.EC === 0) {
                setAvatarUrl(url);
                dispatch(updateUserSuccess({ avatar: url }));
                localStorage.setItem('avatar', url);
                message.success("Cập nhật ảnh đại diện thành công!");
            } else {
                message.error(res?.EM || "Cập nhật ảnh thất bại");
            }
        } catch (err) {
            message.error("Lỗi tải ảnh: " + (err.message || "Thử lại sau"));
        } finally {
            setAvatarLoading(false);
        }
    };

    const tabItems = [
        {
            key: "profile",
            label: (
                <span>
                    <UserOutlined className="mr-1" />
                    Thông tin cá nhân
                </span>
            ),
            children: (
                <div className="p-3">
                    <Form
                        layout="vertical"
                        initialValues={{ fullName: user.fullName || user.name || "", phone: user.phone || "" }}
                        onFinish={handleUpdateProfile}
                    >
                        <Form.Item label="Email">
                            <Input value={user.email} disabled style={{ borderRadius: 8 }} />
                        </Form.Item>
                        <Form.Item
                            name="fullName"
                            label="Họ và tên"
                            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                        >
                            <Input placeholder="Nhập họ và tên" style={{ borderRadius: 8 }} />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại">
                            <Input placeholder="Nhập số điện thoại" style={{ borderRadius: 8 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={profileLoading}
                                style={{ borderRadius: 8, minWidth: 140 }}
                            >
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: "password",
            label: (
                <span>
                    <LockOutlined className="mr-1" />
                    Đổi mật khẩu
                </span>
            ),
            children: (
                <div className="p-3">
                    <Form layout="vertical" onFinish={handleChangePassword}>
                        <Form.Item
                            name="currentPassword"
                            label="Mật khẩu hiện tại"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                        >
                            <Input.Password placeholder="Mật khẩu hiện tại" style={{ borderRadius: 8 }} />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="Mật khẩu mới"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                                { min: 6, message: "Tối thiểu 6 ký tự" },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu mới" style={{ borderRadius: 8 }} />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu mới"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject("Mật khẩu không khớp");
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" style={{ borderRadius: 8 }} />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={pwdLoading}
                                style={{ borderRadius: 8, minWidth: 140 }}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            ),
        },
        {
            key: "avatar",
            label: (
                <span>
                    <CameraOutlined className="mr-1" />
                    Ảnh đại diện
                </span>
            ),
            children: (
                <div className="p-3 text-center">
                    <Spin spinning={avatarLoading}>
                        <div className="mb-4">
                            <Avatar
                                size={120}
                                src={avatarUrl}
                                icon={<UserOutlined />}
                                style={{ border: "3px solid #f0e8df" }}
                            />
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleAvatarChange}
                        />
                        <Button
                            icon={<CameraOutlined />}
                            onClick={() => fileRef.current?.click()}
                            style={{ borderRadius: 8, minWidth: 180 }}
                        >
                            Chọn ảnh mới
                        </Button>
                        <p className="text-gray-500 small mt-3">
                            Hỗ trợ JPG, PNG. Dung lượng tối đa 5MB.
                        </p>
                    </Spin>
                </div>
            ),
        },
    ];

    return (
        <div style={{ background: "#F9F3EC", minHeight: "100vh" }} className="py-5">
            <div className="container">
                <div className="row justify-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="bg-white rounded-4 shadow-sm overflow-hidden">
                            {/* Header */}
                            <div
                                className="p-4 flex items-center gap-3"
                                style={{ background: "#FFF8F0", borderBottom: "1px solid #f0e8df" }}
                            >
                                <Avatar
                                    size={56}
                                    src={avatarUrl}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: "#ff6b35", flexShrink: 0 }}
                                />
                                <div>
                                    <h5 className="mb-0 font-normal" style={{ color: "#3a2e28" }}>
                                        {user.fullName || user.name || "Tài khoản của tôi"}
                                    </h5>
                                    <p className="mb-0 text-gray-500 small">{user.email}</p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <Tabs
                                items={tabItems}
                                defaultActiveKey="profile"
                                style={{ padding: "0 8px" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
