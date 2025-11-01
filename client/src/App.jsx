import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ==== Lazy-loaded pages (code-splitting) ====
const Home = lazy(() => import(/* webpackChunkName: "home" */ "./pages/Home"));
const Menu = lazy(() => import(/* webpackChunkName: "menu" */ "./pages/Menu"));
const Cart = lazy(() => import(/* webpackChunkName: "cart" */ "./pages/Cart"));
const Checkout = lazy(() =>
  import(/* webpackChunkName: "checkout" */ "./pages/Checkout")
);
const AdminLogin = lazy(() =>
  import(/* webpackChunkName: "admin-login" */ "./pages/AdminLogin")
);
const AdminDashboard = lazy(() =>
  import(/* webpackChunkName: "admin-dashboard" */ "./pages/AdminDashboard")
);

// (İsteğe bağlı) Route değişince sayfanın tepesine sar
function ScrollToTop() {
  const { pathname } = useLocation();
  // pathname her değiştiğinde en üste sar
  // (Suspense içindeki içerik mount olurken çalışır)
  // eslint-disable-next-line no-unused-vars
  return window.scrollTo(0, 0), null;
}

function FallbackLoader() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "50vh",
        fontWeight: 700,
        opacity: 0.8,
      }}
    >
      Loading…
    </div>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Suspense fallback={<FallbackLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* 404 için istersen:
          <Route path="*" element={<Home />} />
          */}
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}
