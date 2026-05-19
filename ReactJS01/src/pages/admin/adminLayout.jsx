import { useContext } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/authContext";

const NAV_ITEMS = [
  { to: "/admin/products", label: "Sản phẩm", icon: "ph:package" },
  { to: "/admin/categories", label: "Danh mục", icon: "ph:tag" },
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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "inherit" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#D4A574",
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
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, letterSpacing: 0.5 }}>
              🐾 PetStore Admin
            </div>
          </Link>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginTop: 6 }}>
            {auth.user?.name || auth.user?.email}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          <div style={{ padding: "8px 20px 4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1 }}>
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
                padding: "11px 20px",
                color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                textDecoration: "none",
                borderLeft: isActive ? "3px solid #fff" : "3px solid transparent",
                fontSize: "0.92rem",
                transition: "all 0.2s",
              })}
            >
              <iconify-icon icon={item.icon} style={{ fontSize: "1.1rem" }}></iconify-icon>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", gap: 10 }}>
          <Link
            to="/"
            style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 6 }}
          >
            <iconify-icon icon="ph:arrow-left"></iconify-icon> Về trang chính
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: "transparent", border: "none", color: "rgba(255,100,100,0.7)", cursor: "pointer", textAlign: "left", padding: 0, fontSize: "0.83rem", display: "flex", alignItems: "center", gap: 6 }}
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
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#555", fontSize: "0.88rem" }}>Bảng quản trị hệ thống</span>
          <span style={{ fontSize: "0.83rem", color: "#999", display: "flex", alignItems: "center", gap: 6 }}>
            <iconify-icon icon="ph:user-circle" style={{ fontSize: "1.1rem" }}></iconify-icon>
            {auth.user?.email}
            <span style={{ background: "#e8f4ff", color: "#4e9bff", padding: "2px 8px", borderRadius: 20, fontSize: "0.75rem", marginLeft: 4 }}>Admin</span>
          </span>
        </header>

        <main style={{ flex: 1, padding: 28, overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
