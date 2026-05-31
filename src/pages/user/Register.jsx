import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
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
      await register(form);
      navigate("/profile");
    } catch {
      setError("Không thể đăng ký lúc này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <span className="eyebrow">Tạo tài khoản</span>
        <h1>Đăng ký thành viên mới</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          Họ và tên
          <input name="fullname" value={form.fullname} onChange={handleChange} required />
        </label>
        <label>
          Tên đăng nhập
          <input name="username" value={form.username} onChange={handleChange} required />
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
          {loading ? "Đang tạo..." : "Đăng ký"}
        </button>
        <Link className="form-link" to="/login">
          Đã có tài khoản? Đăng nhập
        </Link>
      </form>
    </section>
  );
}

export default Register;
