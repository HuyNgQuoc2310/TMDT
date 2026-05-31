import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { feedbacks as seedFeedbacks } from "../../data/catalog";
import { useCatalog } from "../../hooks/useCatalog";
import feedbackService from "../../services/feedbackService";
import orderService from "../../services/orderService";

function Feedback() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { products } = useCatalog();
  const selectedProductId = searchParams.get("productId");
  const [feedbacks, setFeedbacks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    productId: selectedProductId || "",
    rating: 5,
    comment: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadFeedbackData() {
      try {
        const [feedbackData, orderData] = await Promise.all([
          feedbackService.getFeedbacks(),
          orderService.getOrdersByUser(user?.id || 2),
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
  }, [user?.id]);

  const completedProductIds = useMemo(() => {
    const ids = orders
      .filter((order) => order.status === "Hoàn thành")
      .flatMap((order) => order.items || [])
      .map((item) => item.productId);

    return new Set(ids);
  }, [orders]);

  const reviewableProducts = useMemo(
    () => products.filter((product) => completedProductIds.has(product.id)),
    [completedProductIds, products]
  );

  useEffect(() => {
    if (selectedProductId && completedProductIds.has(Number(selectedProductId))) {
      setForm((current) => ({ ...current, productId: selectedProductId }));
      return;
    }

    if ((!form.productId || !completedProductIds.has(Number(form.productId))) && reviewableProducts[0]) {
      setForm((current) => ({ ...current, productId: String(reviewableProducts[0].id) }));
    }
  }, [completedProductIds, form.productId, reviewableProducts, selectedProductId]);

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!completedProductIds.has(Number(form.productId))) {
      setError("Bạn chỉ có thể đánh giá sản phẩm trong đơn hàng đã hoàn thành.");
      return;
    }

    const payload = {
      userId: user?.id || 2,
      productId: Number(form.productId),
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
        <h1>Gửi phản hồi sản phẩm</h1>
      </div>

      <div className="split-layout">
        {reviewableProducts.length > 0 ? (
          <form className="panel-form" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-note">{success}</p>}
            <label>
              Sản phẩm
              <select
                value={form.productId}
                onChange={(event) =>
                  setForm((current) => ({ ...current, productId: event.target.value }))
                }
                required
              >
                {reviewableProducts.map((product) => (
                  <option value={product.id} key={product.id}>
                    {product.name}
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
                required
              />
            </label>
            <button className="solid-button" type="submit">
              Gửi đánh giá
            </button>
          </form>
        ) : (
          <div className="empty-state">
            <strong>Chưa có sản phẩm đủ điều kiện đánh giá</strong>
            <p>Chỉ sản phẩm trong đơn hàng có trạng thái Hoàn thành mới được đánh giá.</p>
          </div>
        )}

        <div className="review-list">
          {feedbacks.map((feedback) => (
            <article className="review-card" key={feedback.id}>
              <strong>{productById.get(feedback.productId)?.name || "Sản phẩm"}</strong>
              <span>{"★".repeat(feedback.rating)}</span>
              <p>{feedback.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feedback;
