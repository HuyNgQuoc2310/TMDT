import { Navigate, Route, Routes } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/user/Home";
import ProductList from "../pages/user/ProductList";
import ProductDetail from "../pages/user/ProductDetail";
import Cart from "../pages/user/Cart";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import Checkout from "../pages/user/Checkout";
import Orders from "../pages/user/Orders";
import Profile from "../pages/user/Profile";
import Wishlist from "../pages/user/Wishlist";
import Feedback from "../pages/user/Feedback";
import Dashboard from "../pages/admin/Dashboard";
import ProductManager from "../pages/admin/ProductManager";
import CategoryManager from "../pages/admin/CategoryManager";
import OrderManager from "../pages/admin/OrderManager";
import UserManager from "../pages/admin/UserManager";
import FeedbackManager from "../pages/admin/FeedbackManager";

function RequireAdmin({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="orders" element={<OrderManager />} />
        <Route path="users" element={<UserManager />} />
        <Route path="feedbacks" element={<FeedbackManager />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
