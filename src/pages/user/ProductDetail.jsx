import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCatalog } from "../../hooks/useCatalog";
import wishlistService from "../../services/wishlistService";
import formatPrice from "../../utils/formatPrice";

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { products, categoryById } = useCatalog();
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");
  const product = products.find((item) => item.id === Number(id));

  const handleSaveWishlist = async () => {
    if (!product) {
      return;
    }

    setMessage("");
    try {
      await wishlistService.addWishlist({
        userId: user?.id || 2,
        productId: product.id,
      });
      setMessage("Đã lưu sản phẩm vào danh sách yêu thích.");
    } catch {
      setMessage("Không thể lưu yêu thích lúc này.");
    }
  };

  if (!product) {
    return (
      <section className="empty-state page-empty">
        <strong>Không tìm thấy sản phẩm</strong>
        <p>Sản phẩm có thể đã được gỡ khỏi danh sách.</p>
        <Link className="solid-button" to="/products">
          Quay lại sản phẩm
        </Link>
      </section>
    );
  }

  const category = categoryById.get(product.categoryId);

  return (
    <section className="detail-page">
      <div className="detail-media">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="detail-copy">
        <span className="eyebrow">{category?.name || "Đồ sưu tầm"}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <div className="detail-price">{formatPrice(product.price)}</div>
        <div className="detail-meta">
          <span>Còn {product.stock} sản phẩm</span>
          <span>Kiểm tra ngoại hình trước khi giao</span>
          <span>Đóng gói kỹ cho hộp trưng bày</span>
        </div>
        {message && <p className="form-note">{message}</p>}
        <div className="hero-actions">
          <button className="solid-button" type="button" onClick={() => addToCart(product)}>
            Thêm vào giỏ
          </button>
          <button className="ghost-button" type="button" onClick={handleSaveWishlist}>
            Lưu yêu thích
          </button>
          <Link className="ghost-button" to={`/feedback?productId=${product.id}`}>
            Đánh giá
          </Link>
          <Link className="ghost-button" to="/products">
            Xem thêm sản phẩm
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
