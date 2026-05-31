import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="empty-state page-empty">
        <strong>Bạn chưa đăng nhập</strong>
        <p>Đăng nhập để xem thông tin tài khoản và đơn hàng.</p>
        <Link className="solid-button" to="/login">
          Đăng nhập
        </Link>
      </section>
    );
  }

  return (
    <section className="content-page">
      <div className="section-heading">
        <span className="eyebrow">Tài khoản</span>
        <h1>Thông tin cá nhân</h1>
      </div>

      <div className="profile-grid">
        <div className="info-card">
          <span>Họ tên</span>
          <strong>{user.fullname}</strong>
        </div>
        <div className="info-card">
          <span>Tên đăng nhập</span>
          <strong>{user.username}</strong>
        </div>
        <div className="info-card">
          <span>Vai trò</span>
          <strong>{user.role === "admin" ? "Quản trị" : "Khách hàng"}</strong>
        </div>
      </div>
    </section>
  );
}

export default Profile;
