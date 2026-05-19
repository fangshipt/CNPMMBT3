import { useContext, useState } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  DashboardOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { Avatar, Badge, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [current, setCurrent] = useState("home");

  const items = [
        {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: "Thông tin",
      key: "pages",
      children: [
        {
          label: "Về cửa hàng",
          key: "about",
        },
        {
          label: "Dịch vụ",
          key: "services",
        },
      ],
    },
    {
      label: <Link to={"/products"}>Sản phẩm</Link>,
      key: "shop",
    },
    {
      label: "Bài viết",
      key: "blog",
    },
    {
      label: "Liên hệ",
      key: "contact",
    },
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to={"/user"}>Người dùng</Link>,
            key: "user",
            icon: <UsergroupAddOutlined />,
          },
        ]
      : []),
    {
      label: (
        <div className="header-actions">
          <HeartOutlined aria-label="Yêu thích" />
          <Badge count={3} size="small">
            <ShoppingCartOutlined aria-label="Giỏ hàng" />
          </Badge>
        </div>
      ),
      key: "icons",
    },
    {
      label: auth.isAuthenticated ? (
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Avatar
            size={26}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#ff6b35", flexShrink: 0 }}
          />
          <span>Chào {auth?.user?.name || auth?.user?.email || "bạn"}!</span>
        </span>
      ) : (
        "Tài khoản"
      ),
      key: "account",
      icon: auth.isAuthenticated ? null : <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated && auth.user?.role === "admin"
          ? [
              {
                label: <Link to={"/admin"}>Quản lý cửa hàng</Link>,
                key: "manage-store",
                icon: <DashboardOutlined style={{ color: "#ff6b35" }} />,
              },
            ]
          : []),
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");
                      localStorage.removeItem("role");

                      setCurrent("home");
                      setAuth({
                        isAuthenticated: false,
                        user: { email: "", name: "", role: "" },
                      });

                      navigate("/");
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: "logout",
                icon: <LogoutOutlined />,
              },
            ]
          : [
              {
                label: <Link to={"/login"}>Đăng nhập</Link>,
                key: "login",
                icon: <LoginOutlined />,
              },
            ]),
      ],
    },
  ];

  const onClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <div className="site-header">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        className="site-menu"
      />
    </div>
  );
};

export default Header;
