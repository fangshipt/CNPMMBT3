import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Divider, Form, Input, notification, Row, Steps } from 'antd';
import { ArrowLeftOutlined, UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { registerAuthApi, activateAccountApi } from '../util/api';

const RegisterPage = () => {
    const navigate        = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate]);
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [registerForm] = Form.useForm();
    const [otpForm] = Form.useForm();

    const onRegister = async (values) => {
        setLoading(true);
        const res = await registerAuthApi(
            values.fullName,
            values.email,
            values.password,
            values.confirmPassword
        );
        setLoading(false);

        if (res && res.EC === 0) {
            notification.success({
                message: 'Đăng ký thành công',
                description: res.EM || 'Vui lòng kiểm tra email để lấy mã OTP kích hoạt tài khoản.',
            });
            setEmail(values.email);
            setStep(1);
        } else {
            notification.error({
                message: 'Đăng ký thất bại',
                description: res?.EM || 'Vui lòng kiểm tra lại thông tin.',
            });
        }
    };

    const onActivate = async (values) => {
        setLoading(true);
        const res = await activateAccountApi(email, values.otp);
        setLoading(false);

        if (res && res.EC === 0) {
            notification.success({
                message: 'Kích hoạt thành công',
                description: 'Tài khoản đã được kích hoạt. Bạn có thể đăng nhập ngay.',
            });
            navigate('/login');
        } else {
            notification.error({
                message: 'Kích hoạt thất bại',
                description: res?.EM || 'Mã OTP không hợp lệ hoặc đã hết hạn.',
            });
        }
    };

    const onResendOtp = async () => {
        setLoading(true);
        // Gửi lại bằng cách re-register (backend cập nhật OTP mới nếu chưa active)
        const vals = registerForm.getFieldsValue();
        const res = await registerAuthApi(vals.fullName, email, vals.password, vals.confirmPassword);
        setLoading(false);
        if (res && (res.EC === 0 || res.EC === 2)) {
            notification.info({ message: 'Đã gửi lại OTP', description: 'Kiểm tra hộp thư email.' });
            otpForm.resetFields();
        }
    };

    return (
        <Row justify="center" className="auth-page">
            <Col xs={24} md={16} lg={8}>
                <fieldset className="auth-card">
                    <legend>Đăng ký tài khoản</legend>

                    <Steps
                        size="small"
                        current={step}
                        style={{ marginBottom: 24 }}
                        items={[
                            { title: 'Thông tin', icon: <UserOutlined /> },
                            { title: 'Kích hoạt', icon: <SafetyCertificateOutlined /> },
                        ]}
                    />

                    {step === 0 && (
                        <Form
                            form={registerForm}
                            name="registerForm"
                            onFinish={onRegister}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Form.Item
                                label="Họ và tên"
                                name="fullName"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ và tên.' },
                                    { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự.' },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Họ và tên của bạn" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email.' },
                                    { type: 'email', message: 'Email chưa đúng định dạng.' },
                                ]}
                            >
                                <Input prefix={<MailOutlined />} placeholder="Email của bạn" />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu.' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự.' },
                                    {
                                        pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                                        message: 'Mật khẩu phải có cả chữ cái và chữ số.',
                                    },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu.' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp.'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>
                    )}

                    {step === 1 && (
                        <Form
                            form={otpForm}
                            name="otpForm"
                            onFinish={onActivate}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <p style={{ color: '#555', marginBottom: 16 }}>
                                Mã OTP kích hoạt đã được gửi đến <strong>{email}</strong>. Mã có hiệu lực trong 10 phút.
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
                                    size="large"
                                    style={{ letterSpacing: 6, fontWeight: 'bold' }}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>
                                    Kích hoạt tài khoản
                                </Button>
                            </Form.Item>

                            <Button type="link" style={{ padding: 0 }} onClick={onResendOtp} loading={loading}>
                                Gửi lại mã OTP
                            </Button>
                        </Form>
                    )}

                    <Link to="/">
                        <ArrowLeftOutlined /> Quay lại trang chủ
                    </Link>

                    <Divider />

                    <div className="auth-helper">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};

export default RegisterPage;
