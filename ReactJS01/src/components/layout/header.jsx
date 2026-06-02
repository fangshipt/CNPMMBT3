import { useContext, useState } from "react";
import {
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  DashboardOutlined,
  UserOutlined,
  EnvironmentOutlined,
  OrderedListOutlined,
  HeartOutlined,
} from "@ant-design/icons";

import { Avatar, Badge, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [current, setCurrent] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setCurrent("home");
    setAuth({ isAuthenticated: false, user: { email: "", name: "", role: "" } });
    navigate("/");
  };

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
        { label: <Link to={"/about"}>Về cửa hàng</Link>, key: "about" },
        { label: <Link to={"/services"}>Dịch vụ</Link>, key: "services" },
      ],
    },
    {
      label: <Link to={"/products"}>Sản phẩm</Link>,
      key: "shop",
    },
    {
      label: <Link to={"/blog"}>Bài viết</Link>,
      key: "blog",
    },
    {
      label: <Link to={"/contact"}>Liên hệ</Link>,
      key: "contact",
    },
    {
      label: (
        <div className="header-actions">
          <Badge count={cartCount} size="small" overflowCount={99}>
            <ShoppingCartOutlined
              aria-label="Giỏ hàng"
              style={{ fontSize: "1.1rem" }}
              onClick={() => navigate("/cart")}
            />
          </Badge>
        </div>
      ),
      key: "icons",
    },
    {
      label: auth.isAuthenticated ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, lineHeight: 1 }}>
          <Avatar
            size={26}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#ff6b35", flexShrink: 0 }}
          />
          <span style={{ fontSize: "0.88rem", fontWeight: 500, color: "#3a2e28" }}>
            Chào {auth?.user?.name || auth?.user?.email || "bạn"}!
          </span>
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
        ...(auth.isAuthenticated && auth.user?.role !== "admin"
          ? [
              {
                label: <Link to={"/user"}>Tài khoản của tôi</Link>,
                key: "my-account",
                icon: <UserOutlined />,
              },
              {
                label: <Link to={"/addresses"}>Danh sách địa chỉ</Link>,
                key: "addresses",
                icon: <EnvironmentOutlined />,
              },
              {
                label: <Link to={"/orders"}>Đơn hàng của tôi</Link>,
                key: "orders",
                icon: <OrderedListOutlined />,
              },
              {
                label: <Link to={"/wishlist"}>Sản phẩm yêu thích</Link>,
                key: "wishlist",
                icon: <HeartOutlined />,
              },
            ]
          : []),
        ...(auth.isAuthenticated
          ? [
              {
                label: <span onClick={handleLogout}>Đăng xuất</span>,
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
    if (!["icons"].includes(e.key)) setCurrent(e.key);
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
