import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { orders as seedOrders } from "../../data/catalog";
import orderService from "../../services/orderService";
import formatPrice from "../../utils/formatPrice";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    async function loadOrders() {
      setLoading(true);
      try {
        const data = await orderService.getOrdersByUser(user.id);
        if (mounted) {
          setOrders(data);
        }
      } catch {
        if (mounted) {
          setOrders(seedOrders.filter((order) => order.userId === user.id));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <section className="empty-state page-empty">
        <strong>Bạn cần đăng nhập để xem đơn hàng</strong>
        <p>Lịch sử đặt hàng chỉ hiển thị cho tài khoản đã đăng nhập.</p>
        <Link className="solid-button" to="/login">
          Đăng nhập
        </Link>
      </section>
    );
  }

  return (
    <section className="content-page">
      <div className="section-heading">
        <span className="eyebrow">Đơn hàng</span>
        <h1>Lịch sử đặt hàng</h1>
      </div>

      {orders.length > 0 ? (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    <span className="status-pill">{order.status}</span>
                  </td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <strong>{loading ? "Đang tải đơn hàng..." : "Bạn chưa có đơn hàng"}</strong>
          {!loading && (
            <>
              <p>Hãy chọn sản phẩm và đặt đơn đầu tiên.</p>
              <Link className="solid-button" to="/products">
                Xem sản phẩm
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default Orders;
