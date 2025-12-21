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

const Login = lazy(() => import("./pages/Login")); // Staff Login
const Register = lazy(() => import("./pages/Register")); // ✅ Admin içinden staff oluşturma
const NotFound = lazy(() => import("./pages/NotFound"));

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

  // Admin/Kitchen alanlarında public layout gizle
  const hidePublicLayout =
    path.startsWith("/kitchen") || path.startsWith("/admin");

  return (
    <>
      {!hidePublicLayout && <Navbar />}

      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes (Müşteri login yok) */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />

          {/* Cart = SADECE PERSONEL (STAFF) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["staff"]} redirectTo="/login">
                <Cart />
              </ProtectedRoute>
            }
          />

          {/* Checkout = SADECE PERSONEL (STAFF) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["staff"]} redirectTo="/login">
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

          {/* ✅ Admin -> Staff Create (Register sayfası artık personel oluşturma) */}
          <Route
            path="/admin/staff/create"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
                redirectTo="/admin/login"
              >
                <Register />
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

          {/* Staff Login */}
          <Route path="/login" element={<Login />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {!hidePublicLayout && <Footer />}
    </>
  );
}
