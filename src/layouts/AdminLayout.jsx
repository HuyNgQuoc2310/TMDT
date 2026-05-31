import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand-mark" to="/admin">
          <span className="brand-symbol">QT</span>
          <span>
            <strong>Quản trị shop</strong>
            <small>{user?.fullname}</small>
          </span>
        </Link>

        <nav className="admin-nav" aria-label="Quản trị">
          <NavLink to="/admin" end>
            Tổng quan
          </NavLink>
          <NavLink to="/admin/products">Sản phẩm</NavLink>
          <NavLink to="/admin/categories">Danh mục</NavLink>
          <NavLink to="/admin/orders">Đơn hàng</NavLink>
          <NavLink to="/admin/users">Người dùng</NavLink>
          <NavLink to="/admin/feedbacks">Đánh giá</NavLink>
        </nav>

        <div className="admin-sidebar-actions">
          <Link className="ghost-button" to="/">
            Về cửa hàng
          </Link>
          <button className="ghost-button" type="button" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
