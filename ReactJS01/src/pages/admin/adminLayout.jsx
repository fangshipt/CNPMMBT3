import { useContext } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthContext } from "../../components/context/authContext";

const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

const NAV_ITEMS = [
  { to: "/admin/products", label: "Sản phẩm", icon: "ph:package" },
  { to: "/admin/categories", label: "Danh mục", icon: "ph:tag" },
  { to: "/admin/orders", label: "Đơn hàng", icon: "ph:receipt" },
  { to: "/admin/promotions", label: "Khuyến mãi", icon: "ph:percent" },
  { to: "/admin/blogs", label: "Bài viết", icon: "ph:newspaper" },
];

function AdminLayout() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setAuth({ isAuthenticated: false, user: { email: "", name: "", role: "" } });
    navigate("/login");
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: FONT_FAMILY,
          colorPrimary: "#DEAD6F",
          colorLink: "#5a4a3f",
        },
      }}
    >
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: FONT_FAMILY }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 240,
            background: "#3D2B1F",
            color: "#fff",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 0,
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {/* Logo */}
          <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: 0.5, color: "#DEAD6F" }}>
                🐾 PetStore Admin
              </div>
            </Link>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
              {auth.user?.name || auth.user?.email}
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 0" }}>
            <div style={{ padding: "8px 20px 4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>
              Quản lý
            </div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 20px",
                  color: isActive ? "#DEAD6F" : "rgba(255,255,255,0.82)",
                  background: isActive ? "rgba(222,173,111,0.12)" : "transparent",
                  textDecoration: "none",
                  borderLeft: isActive ? "3px solid #DEAD6F" : "3px solid transparent",
                  fontSize: "0.93rem",
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s",
                })}
              >
                <iconify-icon icon={item.icon} style={{ fontSize: "1.1rem" }}></iconify-icon>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              to="/"
              style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 6 }}
            >
              <iconify-icon icon="ph:arrow-left"></iconify-icon> Về trang chính
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "transparent", border: "none", color: "rgba(255,120,120,0.85)", cursor: "pointer", textAlign: "left", padding: 0, fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_FAMILY }}
            >
              <iconify-icon icon="ph:sign-out"></iconify-icon> Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f9f3ec", minWidth: 0 }}>
          {/* Topbar */}
          <header
            style={{
              background: "#fff",
              padding: "14px 28px",
              borderBottom: "1px solid #e8ddd5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#3a2e28", fontSize: "0.9rem", fontWeight: 600 }}>Bảng quản trị hệ thống</span>
            <span style={{ fontSize: "0.83rem", color: "#5a4a3f", display: "flex", alignItems: "center", gap: 6 }}>
              <iconify-icon icon="ph:user-circle" style={{ fontSize: "1.1rem" }}></iconify-icon>
              {auth.user?.email}
              <span style={{ background: "#fff5e0", color: "#b8860b", padding: "2px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600, marginLeft: 4 }}>Admin</span>
            </span>
          </header>

          <main style={{ flex: 1, padding: 28, overflow: "auto" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default AdminLayout;
