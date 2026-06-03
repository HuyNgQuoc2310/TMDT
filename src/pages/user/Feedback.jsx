import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FeedbackCard from "../../components/FeedbackCard";
import { useAuth } from "../../context/AuthContext";
import { feedbacks as seedFeedbacks } from "../../data/catalog";
import { useCatalog } from "../../hooks/useCatalog";
import feedbackService from "../../services/feedbackService";
import orderService from "../../services/orderService";

function isCompletedOrder(order) {
  return order.status === "Hoàn thành" || order.status === "HoÃ n thÃ nh";
}

function Feedback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { products } = useCatalog();
  const selectedProductId = searchParams.get("productId");
  const [feedbacks, setFeedbacks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderId: "",
    productId: selectedProductId || "",
    rating: 5,
    comment: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUserId = user?.id || 2;

  useEffect(() => {
    let mounted = true;

    async function loadFeedbackData() {
      try {
        const [feedbackData, orderData] = await Promise.all([
          feedbackService.getFeedbacks(),
          orderService.getOrdersByUser(currentUserId),
        ]);
        if (mounted) {
          setFeedbacks(feedbackData);
          setOrders(orderData);
        }
      } catch {
        if (mounted) {
          setFeedbacks(seedFeedbacks);
          setOrders([]);
        }
      }
    }

    loadFeedbackData();
    return () => {
      mounted = false;
    };
  }, [currentUserId]);

  const productById = useMemo(
    () => new Map(products.map((product) => [Number(product.id), product])),
    [products]
  );

  const reviewableItems = useMemo(
    () =>
      orders
        .filter(isCompletedOrder)
        .flatMap((order) =>
          (order.items || []).map((item) => ({
            orderId: Number(order.id),
            productId: Number(item.productId),
            productName: item.name || productById.get(Number(item.productId))?.name || "Sản phẩm",
          }))
        ),
    [orders, productById]
  );

  useEffect(() => {
    if (reviewableItems.length === 0) {
      return;
    }

    const selectedItem = selectedProductId
      ? reviewableItems.find((item) => Number(item.productId) === Number(selectedProductId))
      : null;
    const currentItem = reviewableItems.find(
      (item) =>
        Number(item.orderId) === Number(form.orderId) &&
        Number(item.productId) === Number(form.productId)
    );
    const nextItem = selectedItem || currentItem || reviewableItems[0];

    if (
      Number(form.orderId) !== Number(nextItem.orderId) ||
      Number(form.productId) !== Number(nextItem.productId)
    ) {
      setForm((current) => ({
        ...current,
        orderId: String(nextItem.orderId),
        productId: String(nextItem.productId),
      }));
    }
  }, [form.orderId, form.productId, reviewableItems, selectedProductId]);

  const currentOrderId = Number(form.orderId || 0);
  const currentProductId = Number(form.productId || selectedProductId || 0);
  const visibleFeedbacks = useMemo(
    () => feedbacks.filter((feedback) => Number(feedback.productId) === currentProductId),
    [currentProductId, feedbacks]
  );
  const currentProduct = productById.get(currentProductId);
  const selectedReviewableItem = reviewableItems.find(
    (item) => item.orderId === currentOrderId && item.productId === currentProductId
  );
  const alreadyReviewed = useMemo(
    () =>
      feedbacks.some(
        (feedback) =>
          Number(feedback.userId) === Number(currentUserId) &&
          Number(feedback.productId) === currentProductId &&
          Number(feedback.orderId) === currentOrderId
      ),
    [currentOrderId, currentProductId, currentUserId, feedbacks]
  );

  const handleItemChange = (value) => {
    const [orderId, productId] = value.split(":");
    setError("");
    setSuccess("");
    setForm((current) => ({ ...current, orderId, productId }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedReviewableItem) {
      setError("Bạn chỉ có thể đánh giá sản phẩm trong đơn hàng đã hoàn thành.");
      return;
    }

    if (alreadyReviewed) {
      setError("Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi.");
      return;
    }

    const payload = {
      userId: currentUserId,
      orderId: currentOrderId,
      productId: currentProductId,
      rating: Number(form.rating),
      comment: form.comment,
    };

    try {
      const createdFeedback = await feedbackService.createFeedback(payload);
      setFeedbacks((current) => [createdFeedback, ...current]);
      setForm((current) => ({ ...current, comment: "" }));
      setSuccess("Đã lưu đánh giá của bạn.");
    } catch {
      setFeedbacks((current) => [{ ...payload, id: Date.now() }, ...current]);
      setForm((current) => ({ ...current, comment: "" }));
      setError("Không thể lưu đánh giá lúc này.");
    }
  };

  return (
    <section className="content-page">
      <div className="section-heading">
        <span className="eyebrow">Đánh giá</span>
        <h1>{currentProduct ? `Đánh giá ${currentProduct.name}` : "Gửi phản hồi sản phẩm"}</h1>
      </div>

      <div className="split-layout">
        {reviewableItems.length > 0 ? (
          <form className="panel-form" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-note">{success}</p>}
            {alreadyReviewed && (
              <p className="form-note">
                Bạn đã đánh giá sản phẩm này trong đơn hàng này. Nếu mua lại ở đơn khác, bạn vẫn có thể đánh giá tiếp.
              </p>
            )}
            <label>
              Đơn hàng và sản phẩm
              <select
                value={`${form.orderId}:${form.productId}`}
                onChange={(event) => handleItemChange(event.target.value)}
                required
              >
                {reviewableItems.map((item) => (
                  <option value={`${item.orderId}:${item.productId}`} key={`${item.orderId}-${item.productId}`}>
                    Đơn #{item.orderId} - {item.productName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Số sao
              <select
                value={form.rating}
                onChange={(event) =>
                  setForm((current) => ({ ...current, rating: event.target.value }))
                }
                disabled={alreadyReviewed}
              >
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </label>
            <label>
              Nội dung
              <textarea
                value={form.comment}
                onChange={(event) =>
                  setForm((current) => ({ ...current, comment: event.target.value }))
                }
                disabled={alreadyReviewed}
                required
              />
            </label>
            <button className="solid-button" type="submit" disabled={alreadyReviewed}>
              {alreadyReviewed ? "Đã đánh giá" : "Gửi đánh giá"}
            </button>
          </form>
        ) : (
          <div className="empty-state">
            <strong>Chưa có sản phẩm đủ điều kiện đánh giá</strong>
            <p>Chỉ sản phẩm trong đơn hàng có trạng thái Hoàn thành mới được đánh giá.</p>
          </div>
        )}

        <div className="review-list">
          <h2>Đánh giá của sản phẩm này</h2>
          {visibleFeedbacks.length > 0 ? (
            visibleFeedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                productName={productById.get(Number(feedback.productId))?.name || "Sản phẩm"}
              />
            ))
          ) : (
            <div className="empty-state">
              <strong>Chưa có đánh giá</strong>
              <p>Sản phẩm này chưa có phản hồi nào.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Feedback;
