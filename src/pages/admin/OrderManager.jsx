import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/Pagination";
import { orders as seedOrders, users as seedUsers } from "../../data/catalog";
import orderService from "../../services/orderService";
import userService from "../../services/userService";
import formatPrice from "../../utils/formatPrice";

const PAGE_SIZE = 10;
const statuses = ["Chờ xử lý", "Đang giao", "Hoàn thành", "Đã hủy"];

const emptyFilters = {
  day: "",
  month: "",
  year: "",
};

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orderData, userData] = await Promise.all([
        orderService.getOrders(),
        userService.getUsers(),
      ]);
      setOrders(orderData);
      setUsers(userData);
    } catch {
      setOrders(seedOrders);
      setUsers(seedUsers);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!order.date) {
        return false;
      }

      const [year, month, day] = order.date.split("-");
      return (
        (!filters.day || day === filters.day.padStart(2, "0")) &&
        (!filters.month || month === filters.month.padStart(2, "0")) &&
        (!filters.year || year === filters.year)
      );
    });
  }, [filters, orders]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const pagedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (event) => {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setPage(1);
  };

  const handleStatusChange = async (order, status) => {
    setError("");
    try {
      const updatedOrder = await orderService.updateOrder(order.id, { status });
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? updatedOrder : item))
      );
    } catch {
      setError("Không thể cập nhật trạng thái lúc này.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đơn hàng này?")) {
      return;
    }

    try {
      await orderService.deleteOrder(id);
      setOrders((current) => current.filter((order) => order.id !== id));
      setPage(1);
    } catch {
      setError("Không thể xóa đơn hàng lúc này.");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-heading">
        <span className="eyebrow">Đơn hàng</span>
        <h1>Quản lý đơn hàng</h1>
      </div>
      {error && <p className="form-note">{error}</p>}

      <div className="admin-form compact">
        <input
          name="day"
          type="number"
          min="1"
          max="31"
          value={filters.day}
          onChange={handleFilterChange}
          placeholder="Ngày"
        />
        <input
          name="month"
          type="number"
          min="1"
          max="12"
          value={filters.month}
          onChange={handleFilterChange}
          placeholder="Tháng"
        />
        <input
          name="year"
          type="number"
          value={filters.year}
          onChange={handleFilterChange}
          placeholder="Năm"
        />
        <button className="ghost-button" type="button" onClick={() => setFilters(emptyFilters)}>
          Xóa lọc
        </button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pagedOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{users.find((user) => user.id === order.userId)?.fullname || "Khách"}</td>
                <td>{order.date}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(event) => handleStatusChange(order, event.target.value)}
                  >
                    {statuses.map((status) => (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <div className="table-actions">
                    <button type="button" onClick={() => handleDelete(order.id)}>
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <strong>Không có đơn hàng phù hợp</strong>
            <p>Hãy thay đổi điều kiện lọc ngày, tháng hoặc năm.</p>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}

export default OrderManager;
