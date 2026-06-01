import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import orderService from "../../services/orderService";
import productService from "../../services/productService";
import formatPrice from "../../utils/formatPrice";

function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    phone: "",
    address: "",
    note: "",
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

    if (!user) {
      setError("Bạn cần đăng nhập trước khi đặt hàng.");
      return;
    }

    const invalidItem = items.find(({ product, quantity }) => quantity > product.stock);
    if (invalidItem) {
      setError(`Sản phẩm "${invalidItem.product.name}" không đủ số lượng tồn kho.`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await orderService.createOrder({
        userId: user.id,
        date: new Date().toISOString().slice(0, 10),
        status: "Chờ xử lý",
        total,
        customer: form,
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
      });

      await Promise.all(
        items.map(({ product, quantity }) =>
          productService.updateProduct(product.id, {
            stock: Math.max(0, product.stock - quantity),
          })
        )
      );

      clearCart();
      navigate("/orders");
    } catch {
      setError("Không thể tạo đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="empty-state page-empty">
        <strong>Bạn cần đăng nhập để thanh toán</strong>
        <p>Vui lòng đăng nhập hoặc đăng ký tài khoản trước khi tạo đơn hàng.</p>
        <div className="hero-actions">
          <Link className="solid-button" to="/login">
            Đăng nhập
          </Link>
          <Link className="ghost-button" to="/register">
            Đăng ký
          </Link>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="empty-state page-empty">
        <strong>Không có sản phẩm để thanh toán</strong>
        <p>Giỏ hàng của bạn đang trống.</p>
        <Link className="solid-button" to="/products">
          Xem sản phẩm
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <span className="eyebrow">Thanh toán</span>
        <h1>Thông tin nhận hàng</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          Họ và tên
          <input name="fullname" value={form.fullname} onChange={handleChange} required />
        </label>
        <label>
          Số điện thoại
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="Nhập số điện thoại"
          />
        </label>
        <label>
          Địa chỉ
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Số nhà, đường, phường/xã, quận/huyện"
          />
        </label>
        <label>
          Ghi chú
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Ví dụ: gọi trước khi giao"
          />
        </label>
        <button className="solid-button" type="submit" disabled={loading}>
          {loading ? "Đang tạo đơn..." : "Xác nhận đặt hàng"}
        </button>
      </form>

      <aside className="cart-summary">
        <span>Tổng thanh toán</span>
        <strong>{formatPrice(total)}</strong>
        <p>{items.length} dòng sản phẩm trong giỏ hàng.</p>
      </aside>
    </section>
  );
}

export default Checkout;
