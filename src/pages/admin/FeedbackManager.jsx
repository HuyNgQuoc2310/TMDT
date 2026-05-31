import { useEffect, useMemo, useState } from "react";
import Pagination from "../../components/Pagination";
import { feedbacks as seedFeedbacks, products as seedProducts, users as seedUsers } from "../../data/catalog";
import feedbackService from "../../services/feedbackService";
import productService from "../../services/productService";
import userService from "../../services/userService";

const PAGE_SIZE = 10;

function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [feedbackData, productData, userData] = await Promise.all([
        feedbackService.getFeedbacks(),
        productService.getProducts(),
        userService.getUsers(),
      ]);
      setFeedbacks(feedbackData);
      setProducts(productData);
      setUsers(userData);
    } catch {
      setFeedbacks(seedFeedbacks);
      setProducts(seedProducts);
      setUsers(seedUsers);
    }
  };

  const productById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const userById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const totalPages = Math.ceil(feedbacks.length / PAGE_SIZE);
  const pagedFeedbacks = feedbacks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đánh giá này?")) {
      return;
    }

    try {
      await feedbackService.deleteFeedback(id);
      setFeedbacks((current) => current.filter((feedback) => feedback.id !== id));
      setPage(1);
    } catch {
      setError("Không thể xóa đánh giá lúc này.");
    }
  };

  return (
    <section className="admin-page">
      <div className="section-heading">
        <span className="eyebrow">Đánh giá</span>
        <h1>Quản lý phản hồi</h1>
      </div>
      {error && <p className="form-note">{error}</p>}

      <div className="review-list">
        {pagedFeedbacks.map((feedback) => (
          <article className="review-card" key={feedback.id}>
            <strong>{productById.get(feedback.productId)?.name || "Sản phẩm"}</strong>
            <span>{"★".repeat(feedback.rating)}</span>
            <p>{feedback.comment}</p>
            <small>{userById.get(feedback.userId)?.fullname || "Khách hàng"}</small>
            <div className="table-actions">
              <button type="button" onClick={() => handleDelete(feedback.id)}>
                Xóa
              </button>
            </div>
          </article>
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </section>
  );
}

export default FeedbackManager;
