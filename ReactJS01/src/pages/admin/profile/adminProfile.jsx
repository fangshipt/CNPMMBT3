import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Button, message, Avatar, Tabs, Spin } from "antd";
import { UserOutlined, LockOutlined, CameraOutlined, MailOutlined } from "@ant-design/icons";
import { updateUserSuccess } from "../../../store/authSlice";
import { updateProfileApi, changePasswordApi, updateAvatarApi } from "../../../util/api";
import axios from "../../../util/axios.customize";

const AdminProfile = () => {
    const dispatch = useDispatch();
    const user     = useSelector((state) => state.auth.user);

    const [profileLoading, setProfileLoading] = useState(false);
    const [pwdLoading,     setPwdLoading]     = useState(false);
    const [avatarLoading,  setAvatarLoading]  = useState(false);
    const [avatarUrl,      setAvatarUrl]      = useState(user.avatar || "");
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
            newPassword:     values.newPassword,
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
        if (!file.type.startsWith("image/")) { message.error("Vui lòng chọn file ảnh"); return; }

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
                localStorage.setItem("avatar", url);
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
            label: <span><UserOutlined className="mr-1" />Thông tin cá nhân</span>,
            children: (
                <Form
                    layout="vertical"
                    initialValues={{ fullName: user.fullName || user.name || "", phone: user.phone || "" }}
                    onFinish={handleUpdateProfile}
                    style={{ padding: "8px 0" }}
                >
                    <Form.Item label="Email">
                        <Input value={user.email} disabled prefix={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item label="Vai trò">
                        <Input value="Quản trị viên" disabled />
                    </Form.Item>
                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại">
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={profileLoading}>
                            Lưu thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: "password",
            label: <span><LockOutlined className="mr-1" />Đổi mật khẩu</span>,
            children: (
                <Form layout="vertical" onFinish={handleChangePassword} style={{ padding: "8px 0" }}>
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu mới" },
                            { min: 6, message: "Tối thiểu 6 ký tự" },
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Vui lòng xác nhận mật khẩu" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value)
                                        return Promise.resolve();
                                    return Promise.reject("Mật khẩu không khớp");
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={pwdLoading}>
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: "avatar",
            label: <span><CameraOutlined className="mr-1" />Ảnh đại diện</span>,
            children: (
                <div style={{ padding: "16px 0", textAlign: "center" }}>
                    <Spin spinning={avatarLoading}>
                        <Avatar
                            size={100}
                            src={avatarUrl}
                            icon={<UserOutlined />}
                            style={{ border: "3px solid #DEAD6F", marginBottom: 16 }}
                        />
                        <br />
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleAvatarChange}
                        />
                        <Button icon={<CameraOutlined />} onClick={() => fileRef.current?.click()}>
                            Chọn ảnh mới
                        </Button>
                        <p style={{ color: "#999", fontSize: 12, marginTop: 8 }}>
                            Hỗ trợ JPG, PNG. Tối đa 5MB.
                        </p>
                    </Spin>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h2 style={{ color: "#3a2e28", marginBottom: 24, fontWeight: 700 }}>Hồ sơ của tôi</h2>
            <div style={{ maxWidth: 560, background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ background: "#2e1f14", padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                    <Avatar
                        size={52}
                        src={avatarUrl}
                        icon={<UserOutlined />}
                        style={{ border: "2px solid #DEAD6F", flexShrink: 0 }}
                    />
                    <div>
                        <div style={{ color: "#fff", fontWeight: 600 }}>{user.fullName || user.name || "Admin"}</div>
                        <div style={{ color: "#DEAD6F", fontSize: 12 }}>{user.email}</div>
                    </div>
                </div>
                {/* Tabs */}
                <div style={{ padding: "0 16px" }}>
                    <Tabs items={tabItems} defaultActiveKey="profile" />
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
