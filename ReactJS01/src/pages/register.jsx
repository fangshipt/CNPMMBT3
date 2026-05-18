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

import { createUserApi } from '../util/api';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, email, password } = values;

        try {
            const res = await createUserApi(name, email, password);

            if (res && res.EC === 0) {
                notification.success({
                    message: "Tạo tài khoản thành công",
                    description: res.EM || "Bạn có thể đăng nhập ngay bây giờ."
                });

                navigate("/login");
            } else {
                notification.error({
                    message: "Chưa tạo được tài khoản",
                    description: res?.EM || "Bạn kiểm tra lại thông tin rồi thử lại nhé."
                });
            }
        } catch (error) {
            console.log("Error:", error);
            notification.error({
                message: "Chưa kết nối được",
                description: "Server chưa phản hồi. Bạn thử lại sau ít phút nhé."
            });
        }
    };

    return (
        <Row justify={"center"} className="auth-page">
            <Col xs={24} md={16} lg={8}>
                <fieldset className="auth-card">
                    <legend>Đăng ký tài khoản</legend>

                    <Form
                        name="registerForm"
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
                                {
                                    min: 6,
                                    message: 'Mật khẩu nên có ít nhất 6 ký tự.',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            label="Tên của bạn"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên.',
                                },
                            ]}
                        >
                            <Input placeholder="Tên hiển thị" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Tạo tài khoản
                            </Button>
                        </Form.Item>
                    </Form>

                    <Link to={"/"}>
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>

                    <Divider />

                    <div className="auth-helper">
                        Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default RegisterPage;
