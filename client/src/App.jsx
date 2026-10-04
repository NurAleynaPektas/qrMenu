import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";
import StaffList from "./pages/StaffList";

// =========================================================
// LAZY-LOADED PUBLIC PAGES
// =========================================================

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Menu = lazy(() => import("./pages/Menu"));
const Chefs = lazy(() => import("./pages/Chefs"));

const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));

// =========================================================
// ADMIN
// =========================================================

const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

// =========================================================
// KITCHEN
// =========================================================

const KitchenLogin = lazy(() => import("./pages/KitchenLogin"));

const Kitchen = lazy(() => import("./pages/Kitchen"));

// =========================================================
// AUTH
// =========================================================

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

// =========================================================
// OTHER
// =========================================================

const NotFound = lazy(() => import("./pages/NotFound"));
const QrGenerator = lazy(() => import("./pages/QrGenerator"));

// =========================================================
// SCROLL TO TOP
// =========================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// =========================================================
// APP
// =========================================================

export default function App() {
  return (
    <div className="appShell">
      <Navbar />

      <ScrollToTop />

      <div className="appMain">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* =============================================
                PUBLIC
            ============================================= */}

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/menu" element={<Menu />} />

            <Route path="/chefs" element={<Chefs />} />

            {/* =============================================
                QR
            ============================================= */}

            <Route path="/qr" element={<Navigate to="/menu" replace />} />

            <Route path="/qr-code" element={<QrGenerator />} />

            {/* =============================================
                STAFF
            ============================================= */}

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

            {/* =============================================
                ADMIN
            ============================================= */}

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

            {/* =============================================
                KITCHEN
            ============================================= */}

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

            {/* =============================================
                STAFF LOGIN
            ============================================= */}

            <Route path="/login" element={<Login />} />

            {/* =============================================
                404
            ============================================= */}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
