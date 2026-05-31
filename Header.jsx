import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="site-header">
      <Link className="brand-mark" to="/">
        <span className="brand-symbol">MH</span>
        <span>
          <strong>Mô Hình Store</strong>
          <small>Đồ sưu tầm chính hãng</small>
        </span>
      </Link>

      <nav className="main-nav" aria-label="Điều hướng chính">
        <NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/products">Sản phẩm</NavLink>
        <NavLink to="/cart">Giỏ hàng {count > 0 && <span>{count}</span>}</NavLink>
      </nav>

      <div className="header-actions">
        {user ? (
          <>
            <span className="user-chip">{user.fullname}</span>
            {user.role === "admin" ? (
              <Link className="ghost-button" to="/admin">
                Quản trị
              </Link>
            ) : (
              <>
                <Link className="ghost-button" to="/orders">
                  Đơn hàng
                </Link>
                <Link className="ghost-button" to="/feedback">
                  Đánh giá
                </Link>
              </>
            )}
            <button className="ghost-button" type="button" onClick={logout}>
              Đăng xuất
            </button>
          </>
        ) : (
          <Link className="solid-button small" to="/login">
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
