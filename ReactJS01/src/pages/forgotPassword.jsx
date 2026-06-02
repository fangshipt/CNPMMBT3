import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Divider, Form, Input, notification, Row, Steps } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordApi, resetPasswordApi } from '../util/api';

const ForgotPasswordPage = () => {
    const navigate        = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailForm] = Form.useForm();
    const [resetForm] = Form.useForm();

    const onSendOtp = async (values) => {
        setLoading(true);
        const res = await forgotPasswordApi(values.email);
        setLoading(false);

        // EC=-1 là lỗi thật (rate limit, server lỗi)
        if (!res || res.EC === -1) {
            notification.error({
                message: 'Không thể gửi OTP',
                description: res?.EM || 'Đã xảy ra lỗi, vui lòng thử lại sau.',
            });
            return;
        }

        // EC=0: backend không tiết lộ email có tồn tại hay không
        notification.success({
            message: 'Đã gửi mã OTP',
            description: res?.EM || 'Kiểm tra hộp thư email của bạn.',
        });
        setEmail(values.email);
        setStep(1);
    };

    const onResetPassword = async (values) => {
        setLoading(true);
        const res = await resetPasswordApi(email, values.otp, values.newPassword, values.confirmPassword);
        setLoading(false);

        if (res && res.EC === 0) {
            notification.success({
                message: 'Đặt lại mật khẩu thành công',
                description: 'Bạn có thể đăng nhập với mật khẩu mới.',
            });
            navigate('/login');
        } else {
            notification.error({
                message: 'Không thành công',
                description: res?.EM || 'Mã OTP không hợp lệ hoặc đã hết hạn.',
            });
        }
    };

    return (
        <Row justify="center" className="auth-page">
            <Col xs={24} md={16} lg={8}>
                <fieldset className="auth-card">
                    <legend>Quên mật khẩu</legend>

                    <Steps
                        size="small"
                        current={step}
                        style={{ marginBottom: 24 }}
                        items={[
                            { title: 'Nhập email', icon: <MailOutlined /> },
                            { title: 'Đặt lại mật khẩu', icon: <LockOutlined /> },
                        ]}
                    />

                    {step === 0 && (
                        <Form
                            form={emailForm}
                            name="forgotForm"
                            onFinish={onSendOtp}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <p style={{ color: '#555', marginBottom: 16 }}>
                                Nhập email đã đăng ký. Chúng tôi sẽ gửi mã OTP (6 số) để đặt lại mật khẩu.
                            </p>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email.' },
                                    { type: 'email', message: 'Email chưa đúng định dạng.' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email đã đăng ký" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Gửi mã OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {step === 1 && (
                        <Form
                            form={resetForm}
                            name="resetForm"
                            onFinish={onResetPassword}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <p style={{ color: '#555', marginBottom: 16 }}>
                                Mã OTP đã được gửi đến <strong>{email}</strong>. Mã có hiệu lực trong 10 phút.
                            </p>

                            <Form.Item
                                label="Mã OTP"
                                name="otp"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã OTP.' },
                                    { len: 6, message: 'Mã OTP gồm 6 chữ số.' },
                                    { pattern: /^\d{6}$/, message: 'Mã OTP chỉ gồm chữ số.' },
                                ]}
                            >
                                <Input
                                    prefix={<SafetyCertificateOutlined />}
                                    placeholder="Nhập mã 6 số từ email"
                                    maxLength={6}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới.' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
                                    {
                                        pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                                        message: 'Mật khẩu phải có cả chữ cái và chữ số.',
                                    },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu.' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>

                            <Button
                                type="link"
                                style={{ padding: 0 }}
                                onClick={() => { setStep(0); resetForm.resetFields(); }}
                            >
                                Gửi lại OTP
                            </Button>
                        </Form>
                    )}

                    <Link to="/login">
                        <ArrowLeftOutlined /> Quay lại đăng nhập
                    </Link>

                    <Divider />

                    <div className="auth-helper">
                        Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default ForgotPasswordPage;
