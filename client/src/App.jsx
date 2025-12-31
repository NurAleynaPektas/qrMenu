import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import StaffList from "./pages/StaffList";

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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="appShell">
      <Navbar />
      <ScrollToTop />
      <div className="appMain">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />

            {/* Staff only */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute allowedRoles={["staff"]} redirectTo="/login">
                  <Cart />
                </ProtectedRoute>
              }
            />
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

            {/* Admin Staff List */}
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute
                  allowedRoles={["admin"]}
                  redirectTo="/admin/login"
                >
                  <StaffList />
                </ProtectedRoute>
              }
            />

            {/* Admin Staff Create */}
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
      </div>
      <Footer />
    </div>
  );
}
