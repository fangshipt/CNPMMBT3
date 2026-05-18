import { useContext, useState } from "react";
import {
  UsergroupAddOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
} from "@ant-design/icons";

import { Badge, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth.context";

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [current, setCurrent] = useState("home");

  const items = [
    {
      label: <span className="menu-category-label">Danh mục</span>,
      key: "category",
    },
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
      label: "Sản phẩm",
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
      label: auth.isAuthenticated
        ? `Xin chào ${auth?.user?.name || auth?.user?.email || "bạn"}`
        : "Tài khoản",
      key: "account",
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("email");
                      localStorage.removeItem("name");

                      setCurrent("home");
                      setAuth({
                        isAuthenticated: false,
                        user: {
                          email: "",
                          name: "",
                        },
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
