import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const nextUser = await login(form);
      navigate(nextUser.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.message || "Không thể đăng nhập lúc này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">Tài khoản</span>
        <h1>Đăng nhập để quản lý bộ sưu tập</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          Tên đăng nhập
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mật khẩu
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button className="solid-button" type="submit" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <Link className="form-link" to="/register">
          Chưa có tài khoản? Đăng ký
        </Link>
      </form>
    </section>
  );
}

export default Login;
