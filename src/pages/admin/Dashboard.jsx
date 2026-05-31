import { useEffect, useState } from "react";
import { categories as seedCategories, feedbacks as seedFeedbacks, orders as seedOrders, products as seedProducts, users as seedUsers } from "../../data/catalog";
import feedbackService from "../../services/feedbackService";
import orderService from "../../services/orderService";
import productService from "../../services/productService";
import userService from "../../services/userService";
import formatPrice from "../../utils/formatPrice";

function Dashboard() {
  const [data, setData] = useState({
    products: [],
    categories: [],
    orders: [],
    users: [],
    feedbacks: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [products, categories, orders, users, feedbacks] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
          orderService.getOrders(),
          userService.getUsers(),
          feedbackService.getFeedbacks(),
        ]);
        setData({ products, categories, orders, users, feedbacks });
      } catch {
        setData({
          products: seedProducts,
          categories: seedCategories,
          orders: seedOrders,
          users: seedUsers,
          feedbacks: seedFeedbacks,
        });
      }
    }

    loadData();
  }, []);

  const revenue = data.orders.reduce((sum, order) => sum + order.total, 0);
  const totalStock = data.products.reduce((sum, product) => sum + product.stock, 0);

  return (
    <section className="admin-page">
      <div className="section-heading">
        <span className="eyebrow">Quản trị</span>
        <h1>Tổng quan cửa hàng</h1>
      </div>

      <div className="admin-stats">
        <div className="info-card">
          <span>Sản phẩm</span>
          <strong>{data.products.length}</strong>
        </div>
        <div className="info-card">
          <span>Danh mục</span>
          <strong>{data.categories.length}</strong>
        </div>
        <div className="info-card">
          <span>Tồn kho</span>
          <strong>{totalStock}</strong>
        </div>
        <div className="info-card">
          <span>Doanh thu</span>
          <strong>{formatPrice(revenue)}</strong>
        </div>
      </div>

      <div className="split-layout">
        <div className="table-card">
          <h2>Đơn hàng gần đây</h2>
          <table>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách</th>
                <th>Trạng thái</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{data.users.find((user) => user.id === order.userId)?.fullname || "Khách"}</td>
                  <td><span className="status-pill">{order.status}</span></td>
                  <td>{formatPrice(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="review-list">
          <h2>Đánh giá mới</h2>
          {data.feedbacks.map((feedback) => (
            <article className="review-card" key={feedback.id}>
              <strong>{data.products.find((product) => product.id === feedback.productId)?.name}</strong>
              <span>{"★".repeat(feedback.rating)}</span>
              <p>{feedback.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
