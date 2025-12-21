import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const KitchenLogin = lazy(() => import("./pages/KitchenLogin"));
const Kitchen = lazy(() => import("./pages/Kitchen"));

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const path = location.pathname;

  const hidePublicLayout =
    path.startsWith("/kitchen") ||
    path.startsWith("/admin") ||
    path.startsWith("/staff");

  return (
    <>
      {!hidePublicLayout && <Navbar />}

      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected (User Login Required) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/admin/login"
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Kitchen */}
          <Route path="/kitchen/login" element={<KitchenLogin />} />
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute
                allowedRoles={["kitchen"]}
                redirectTo="/kitchen/login"
              >
                <Kitchen />
              </ProtectedRoute>
            }
          />

          {/* Auth (Customer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!hidePublicLayout && <Footer />}
    </>
  );
}
