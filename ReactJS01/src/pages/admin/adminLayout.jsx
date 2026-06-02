import { useContext } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import { AuthContext } from "../../components/context/authContext";

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const NAV_ITEMS = [
  { to: "/admin/profile",    label: "Hồ sơ",      icon: "ph:user-circle" },
  { to: "/admin/products",   label: "Sản phẩm",   icon: "ph:package" },
  { to: "/admin/categories", label: "Danh mục",   icon: "ph:tag" },
  { to: "/admin/orders",     label: "Đơn hàng",   icon: "ph:receipt" },
  { to: "/admin/promotions", label: "Khuyến mãi", icon: "ph:percent" },
  { to: "/admin/blogs",      label: "Bài viết",   icon: "ph:newspaper" },
  { to: "/admin/revenue",    label: "Doanh thu",  icon: "ph:chart-bar" },
  { to: "/admin/chat",       label: "Chat",        icon: "ph:chat-circle-dots" },
];

const S = {
  root: { display: "flex", minHeight: "100vh", fontFamily: FONT, background: "#f5efe8" },

  sidebar: {
    width: 220, flexShrink: 0,
    display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh", overflowY: "auto",
    background: "#2e1f14",
    boxShadow: "2px 0 12px rgba(0,0,0,0.18)",
  },

  logoArea: {
    padding: "24px 20px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  logoTitle: {
    fontSize: "1.05rem", fontWeight: 700, color: "#DEAD6F",
    textDecoration: "none", display: "flex", alignItems: "center", gap: 8,
  },
  userChip: {
    marginTop: 12,
    display: "flex", alignItems: "center", gap: 10,
  },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "rgba(222,173,111,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  userName: { fontSize: "0.83rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 },
  userRole: {
    fontSize: "0.68rem", color: "#DEAD6F",
    background: "rgba(222,173,111,0.12)",
    borderRadius: 4, padding: "1px 6px", marginTop: 2,
    display: "inline-block",
  },

  navSection: { flex: 1, padding: "12px 0" },
  navLabel: {
    padding: "10px 20px 6px",
    fontSize: "0.65rem", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
    fontWeight: 600,
  },

  sideFooter: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    display: "flex", flexDirection: "column", gap: 4,
  },
  footerLink: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 10px", borderRadius: 8,
    fontSize: "0.83rem", color: "rgba(255,255,255,0.55)",
    textDecoration: "none", cursor: "pointer",
    background: "transparent", border: "none",
    fontFamily: FONT, textAlign: "left", transition: "background 0.2s",
  },

  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },

  topbar: {
    background: "#fff",
    borderBottom: "1px solid #ecddd0",
    padding: "0 28px",
    height: 56, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: 10 },
  breadcrumb: { fontSize: "0.78rem", color: "#b8a090" },
  topbarRight: { display: "flex", alignItems: "center", gap: 10 },
  adminBadge: {
    fontSize: "0.72rem", fontWeight: 700,
    background: "#fff5e0", color: "#b8860b",
    borderRadius: 20, padding: "3px 10px",
  },

  content: { flex: 1, padding: "28px 32px", overflowY: "auto" },
};

function NavItem({ item }) {
  return (
    <NavLink
      to={item.to}
      style={({ isActive }) => ({
        display: "flex", alignItems: "center", gap: 11,
        margin: "2px 10px",
        padding: "10px 14px",
        borderRadius: 10,
        color: isActive ? "#DEAD6F" : "rgba(255,255,255,0.7)",
        background: isActive ? "rgba(222,173,111,0.13)" : "transparent",
        textDecoration: "none",
        fontSize: "0.88rem",
        fontWeight: isActive ? 600 : 400,
        transition: "background 0.18s, color 0.18s",
      })}
    >
      <iconify-icon icon={item.icon} style={{ fontSize: "1.05rem", flexShrink: 0 }}></iconify-icon>
      {item.label}
    </NavLink>
  );
}

function AdminLayout() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const userName = auth.user?.name || auth.user?.email?.split("@")[0] || "Admin";

  const handleLogout = () => {
    ["access_token", "email", "name", "role"].forEach(k => localStorage.removeItem(k));
    setAuth({ isAuthenticated: false, user: { email: "", name: "", role: "" } });
    navigate("/login");
  };

  return (
    <ConfigProvider theme={{ token: { fontFamily: FONT, colorPrimary: "#DEAD6F", colorLink: "#5a4a3f" } }}>
      <div style={S.root}>

        {/* ── Sidebar ── */}
        <aside style={S.sidebar}>

          {/* Logo + user */}
          <div style={S.logoArea}>
            <Link to="/" style={S.logoTitle}>
              <iconify-icon icon="ph:paw-print-fill" style={{ fontSize: "1.2rem" }}></iconify-icon>
              FangShi Pet Shop
            </Link>
            <div style={S.userChip}>
              <div style={S.avatar}>
                <iconify-icon icon="ph:user-bold" style={{ fontSize: "1rem", color: "#DEAD6F" }}></iconify-icon>
              </div>
              <div>
                <div style={S.userName}>{userName}</div>
                <span style={S.userRole}>Quản trị viên</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={S.navSection}>
            <div style={S.navLabel}>Quản lý</div>
            {NAV_ITEMS.map(item => <NavItem key={item.to} item={item} />)}
          </nav>

          {/* Footer */}
          <div style={S.sideFooter}>
            <Link to="/" style={{ ...S.footerLink, color: "rgba(255,255,255,0.5)" }}>
              <iconify-icon icon="ph:arrow-left"></iconify-icon> Về trang chính
            </Link>
            <button onClick={handleLogout} style={{ ...S.footerLink, color: "rgba(255,120,100,0.85)" }}>
              <iconify-icon icon="ph:sign-out"></iconify-icon> Đăng xuất
            </button>
          </div>

        </aside>

        {/* ── Main ── */}
        <div style={S.main}>

          {/* Topbar */}
          <header style={S.topbar}>
            <div style={S.topbarLeft}>
              <iconify-icon icon="ph:squares-four" style={{ fontSize: "1.1rem", color: "#c8a87a" }}></iconify-icon>
              <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#3a2e28" }}>Bảng quản trị</span>
            </div>
            <div style={S.topbarRight}>
              <div style={S.avatar}>
                <iconify-icon icon="ph:user-bold" style={{ fontSize: "0.95rem", color: "#DEAD6F" }}></iconify-icon>
              </div>
              <span style={{ fontSize: "0.85rem", color: "#5a4a3f", fontWeight: 500 }}>{userName}</span>
              <span style={S.adminBadge}>Admin</span>
            </div>
          </header>

          {/* Content */}
          <main style={S.content}>
            <Outlet />
          </main>

        </div>
      </div>
    </ConfigProvider>
  );
}

export default AdminLayout;
