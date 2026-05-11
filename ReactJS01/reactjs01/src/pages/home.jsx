import {
    Button,
    Card,
    Col,
    Row,
    Typography,
    Space
} from 'antd';

import {
    LoginOutlined,
    UserAddOutlined,
    DatabaseOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage = () => {

    return (
        <div
            style={{
                minHeight: '100vh',
                padding: '40px',
                background: '#f5f5f5'
            }}
        >

            <Row justify="center">

                <Col xs={24} md={20} lg={16}>

                    <Card
                        style={{
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >

                        <Space
                            direction="vertical"
                            size="large"
                            style={{ width: '100%' }}
                        >

                            <div style={{ textAlign: 'center' }}>

                                <Title>
                                    FullStack Authentication System
                                </Title>

                                <Paragraph style={{ fontSize: '16px' }}>
                                    ReactJS + ExpressJS + MongoDB + JWT Authentication
                                </Paragraph>

                            </div>

                            <Row gutter={[16, 16]}>

                                <Col xs={24} md={12}>

                                    <Card>

                                        <Space direction="vertical">

                                            <DatabaseOutlined style={{ fontSize: '28px' }} />

                                            <Title level={4}>
                                                MongoDB Database
                                            </Title>

                                            <Paragraph>
                                                Lưu trữ thông tin user bằng MongoDB và Mongoose.
                                            </Paragraph>

                                        </Space>

                                    </Card>

                                </Col>

                                <Col xs={24} md={12}>

                                    <Card>

                                        <Space direction="vertical">

                                            <SafetyCertificateOutlined style={{ fontSize: '28px' }} />

                                            <Title level={4}>
                                                JWT Authentication
                                            </Title>

                                            <Paragraph>
                                                Xác thực người dùng bằng access token và middleware.
                                            </Paragraph>

                                        </Space>

                                    </Card>

                                </Col>

                            </Row>

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>

                                <Space size="middle">

                                    <Link to="/login">

                                        <Button
                                            type="primary"
                                            icon={<LoginOutlined />}
                                            size="large"
                                        >
                                            Đăng nhập
                                        </Button>

                                    </Link>

                                    <Link to="/register">

                                        <Button
                                            icon={<UserAddOutlined />}
                                            size="large"
                                        >
                                            Đăng ký
                                        </Button>

                                    </Link>

                                </Space>

                            </div>

                        </Space>

                    </Card>

                </Col>

            </Row>

        </div>
    )
}

export default HomePage;


