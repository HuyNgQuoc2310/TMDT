import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FeedbackCard from "../../components/FeedbackCard";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { feedbacks as seedFeedbacks } from "../../data/catalog";
import { useCatalog } from "../../hooks/useCatalog";
import feedbackService from "../../services/feedbackService";
import wishlistService from "../../services/wishlistService";
import formatPrice from "../../utils/formatPrice";

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { products, categoryById } = useCatalog();
  const { addToCart } = useCart();
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const product = products.find((item) => item.id === Number(id));

  useEffect(() => {
    let mounted = true;

    async function loadFeedbacks() {
      if (!id) {
        return;
      }

      try {
        const data = await feedbackService.getFeedbacksByProduct(Number(id));
        if (mounted) {
          setFeedbacks(data);
        }
      } catch {
        if (mounted) {
          setFeedbacks(seedFeedbacks.filter((feedback) => Number(feedback.productId) === Number(id)));
        }
      }
    }

    loadFeedbacks();
    return () => {
      mounted = false;
    };
  }, [id]);

  const ratingStats = useMemo(() => {
    const validFeedbacks = feedbacks.filter((feedback) => Number(feedback.rating) > 0);
    const totalRating = validFeedbacks.reduce(
      (total, feedback) => total + Number(feedback.rating),
      0
    );
    const averageRating = validFeedbacks.length > 0 ? totalRating / validFeedbacks.length : 0;

    return {
      averageRating,
      reviewCount: validFeedbacks.length,
    };
  }, [feedbacks]);

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
  const averageRatingText = ratingStats.averageRating.toFixed(1);

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
        <div className="rating-summary">
          {ratingStats.reviewCount > 0 ? (
            <>
              <strong>{averageRatingText}/5</strong>
              <span>{"★".repeat(Math.round(ratingStats.averageRating))}</span>
              <small>{ratingStats.reviewCount} đánh giá</small>
            </>
          ) : (
            <small>Chưa có điểm đánh giá</small>
          )}
        </div>
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

        <section className="product-reviews">
          <div className="section-heading compact-heading">
            <span className="eyebrow">Phản hồi</span>
            <h2>Đánh giá của sản phẩm</h2>
            {ratingStats.reviewCount > 0 && (
              <p>
                Điểm trung bình {averageRatingText}/5 từ {ratingStats.reviewCount} đánh giá.
              </p>
            )}
          </div>
          <div className="review-list">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} productName={product.name} />
              ))
            ) : (
              <div className="empty-state">
                <strong>Chưa có đánh giá</strong>
                <p>Sản phẩm này chưa có phản hồi nào.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export default ProductDetail;
