import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { users as seedUsers } from "../../data/catalog";
import userService from "../../services/userService";

const PAGE_SIZE = 10;

const emptyUser = {
  fullname: "",
  username: "",
  password: "123456",
  role: "user",
};

function UserManager() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setUsers(await userService.getUsers());
    } catch {
      setUsers(seedUsers);
    }
  };

  const totalPages = Math.ceil(users.length / PAGE_SIZE);
  const pagedUsers = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const resetForm = () => {
    setForm(emptyUser);
    setEditingId(null);
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      fullname: user.fullname,
      username: user.username,
      password: user.password || "123456",
      role: user.role,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        const updatedUser = await userService.updateUser(editingId, form);
        setUsers((current) => current.map((user) => (user.id === editingId ? updatedUser : user)));
      } else {
        const createdUser = await userService.createUser(form);
        setUsers((current) => [...current, createdUser]);
      }
      resetForm();
    } catch {
      setError("Không thể lưu tài khoản lúc này.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa tài khoản này?")) {
      return;
    }

    try {
      await userService.deleteUser(id);
      setUsers((current) => current.filter((user) => user.id !== id));
      setPage(1);
    } catch {
      setError("Không thể xóa tài khoản lúc này.");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-heading">
        <span className="eyebrow">Người dùng</span>
        <h1>Quản lý tài khoản</h1>
      </div>

      <form className="admin-form compact" onSubmit={handleSubmit}>
        {error && <p className="form-note">{error}</p>}
        <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Họ tên" required />
        <input name="username" value={form.username} onChange={handleChange} placeholder="Tên đăng nhập" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Mật khẩu" required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Khách hàng</option>
          <option value="admin">Quản trị</option>
        </select>
        <button className="solid-button" type="submit">
          {editingId ? "Cập nhật" : "Thêm tài khoản"}
        </button>
        {editingId && (
          <button className="ghost-button" type="button" onClick={resetForm}>
            Hủy
          </button>
        )}
      </form>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pagedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullname}</td>
                <td>{user.username}</td>
                <td>{user.role === "admin" ? "Quản trị" : "Khách hàng"}</td>
                <td>
                  <div className="table-actions">
                    <button type="button" onClick={() => handleEdit(user)}>
                      Sửa
                    </button>
                    <button type="button" onClick={() => handleDelete(user.id)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}

export default UserManager;
