import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import formatPrice from "../../utils/formatPrice";

function Cart() {
  const { user } = useAuth();
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <section className="empty-state page-empty">
        <strong>Giỏ hàng đang trống</strong>
        <p>Hãy thêm một mô hình hoặc bộ lắp ráp trước khi thanh toán.</p>
        <Link className="solid-button" to="/products">
          Xem sản phẩm
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="section-heading">
        <span className="eyebrow">Giỏ hàng</span>
        <h1>Kiểm tra sản phẩm trước khi đặt hàng</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {items.map(({ product, quantity }) => (
            <article className="cart-row" key={product.id}>
              <img src={product.image} alt={product.name} />
              <div>
                <strong>{product.name}</strong>
                <span>{formatPrice(product.price)}</span>
              </div>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  updateQuantity(product.id, Number(event.target.value))
                }
              />
              <button type="button" onClick={() => removeFromCart(product.id)}>
                Xóa
              </button>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span>Tạm tính</span>
          <strong>{formatPrice(total)}</strong>
          <p>Phí vận chuyển sẽ được tính sau khi xác nhận địa chỉ nhận hàng.</p>
          {user ? (
            <Link className="solid-button" to="/checkout">
              Thanh toán
            </Link>
          ) : (
            <>
              <p className="form-note">Bạn cần đăng nhập trước khi đặt hàng.</p>
              <Link className="solid-button" to="/login">
                Đăng nhập để thanh toán
              </Link>
            </>
          )}
          <button className="ghost-button full-width" type="button" onClick={clearCart}>
            Xóa giỏ hàng
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
