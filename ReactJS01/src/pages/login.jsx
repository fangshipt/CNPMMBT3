import { useContext } from 'react';

import {
    Button,
    Col,
    Divider,
    Form,
    Input,
    notification,
    Row
} from 'antd';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../components/context/authContext';
import { loginApi } from '../util/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuth } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;
        const res = await loginApi(email, password);

        if (res && res.EC === 0) {
            localStorage.setItem("access_token", res.access_token);
            localStorage.setItem("email", res?.user?.email ?? "");
            localStorage.setItem("name", res?.user?.fullName ?? "");
            localStorage.setItem("role", res?.user?.role ?? "");

            notification.success({
                message: "Đăng nhập thành công",
                description: "Chào mừng bạn quay lại."
            });

            setAuth({
                isAuthenticated: true,
                user: {
                    email: res?.user?.email ?? "",
                    name: res?.user?.fullName ?? "",
                    role: res?.user?.role ?? "",
                }
            });

            navigate("/");
        } else {
            notification.error({
                message: "Chưa đăng nhập được",
                description: res?.EM ?? "Email hoặc mật khẩu chưa đúng."
            });
        }
    };

    return (
        <Row justify={"center"} className="auth-page">
            <Col xs={24} md={16} lg={8}>
                <fieldset className="auth-card">
                    <legend>Đăng nhập</legend>

                    <Form
                        name="loginForm"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email.',
                                },
                                {
                                    type: 'email',
                                    message: 'Email chưa đúng định dạng.',
                                },
                            ]}
                        >
                            <Input placeholder="Email của bạn" />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu.',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link to={"/"}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>

                    <Divider />

                    <div className="auth-helper">
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default LoginPage;
