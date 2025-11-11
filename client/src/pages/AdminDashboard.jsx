import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import s from "./AdminDashboard.module.css";

// Başlangıç sipariş listemiz (mock)
const initialOrders = [
  {
    id: "ORD-101",
    table: 5,
    items: "Köfte Menü x2, Ayran x2",
    total: 540,
    status: "pending",
    time: "12:34",
  },
  {
    id: "ORD-102",
    table: 3,
    items: "Klasik Burger x1, Limonata x1",
    total: 220,
    status: "preparing",
    time: "12:40",
  },
  {
    id: "ORD-103",
    table: 1,
    items: "Sufle x2, Ayran x1",
    total: 210,
    status: "completed",
    time: "12:10",
  },
  {
    id: "ORD-104",
    table: 7,
    items: "Köfte Menü x1, Limonata x2",
    total: 250,
    status: "pending",
    time: "12:45",
  },
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const admin = useSelector((state) => state.auth.user);

  // 🔥 Artık siparişleri state'te tutuyoruz
  const [orders, setOrders] = useState(initialOrders);

  // İstatistikler her seferinde tekrar hesaplanmasın diye useMemo kullanalım
  const { totalOrders, pendingCount, completedCount, totalRevenue } =
    useMemo(() => {
      const totalOrders = orders.length;
      const pendingCount = orders.filter((o) => o.status === "pending").length;
      const completedCount = orders.filter(
        (o) => o.status === "completed"
      ).length;
      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

      return { totalOrders, pendingCount, completedCount, totalRevenue };
    }, [orders]);

  // Tablo içindeki select'ten status değiştirildiğinde çalışacak
  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
            }
          : o
      )
    );
  };

  const statusLabel = (status) => {
    switch (status) {
      case "pending":
        return t("admin.status_pending") || "Beklemede";
      case "preparing":
        return t("admin.status_preparing") || "Hazırlanıyor";
      case "completed":
        return t("admin.status_completed") || "Tamamlandı";
      default:
        return status;
    }
  };

  return (
    <main className={s.page}>
      {/* Üst kısım - başlık + admin bilgisi */}
      <section className={s.header}>
        <div>
          <h1 className={s.title}>
            {t("admin.dashboard_title") || "Admin Dashboard"}
          </h1>
          <p className={s.subtitle}>
            {t("admin.dashboard_sub") ||
              "Track orders, tables and revenue in one place."}
          </p>
        </div>
        {admin && (
          <div className={s.adminBadge}>
            <span className={s.adminAvatar}>
              {(admin.name || admin.email || "A").charAt(0).toUpperCase()}
            </span>
            <div className={s.adminText}>
              <span className={s.adminLabel}>
                {t("admin.logged_in_as") || "Logged in as"}
              </span>
              <span className={s.adminName}>{admin.name || admin.email}</span>
            </div>
          </div>
        )}
      </section>

      {/* Kartlar - istatistikler */}
      <section className={s.statsGrid}>
        <div className={s.statCard}>
          <span className={s.statLabel}>
            {t("admin.total_orders") || "Total Orders"}
          </span>
          <span className={s.statValue}>{totalOrders}</span>
        </div>
        <div className={s.statCard}>
          <span className={s.statLabel}>
            {t("admin.pending_orders") || "Pending"}
          </span>
          <span className={s.statValue}>{pendingCount}</span>
        </div>
        <div className={s.statCard}>
          <span className={s.statLabel}>
            {t("admin.completed_orders") || "Completed"}
          </span>
          <span className={s.statValue}>{completedCount}</span>
        </div>
        <div className={s.statCard}>
          <span className={s.statLabel}>
            {t("admin.revenue_today") || "Revenue (Today)"}
          </span>
          <span className={s.statValue}>₺{totalRevenue}</span>
        </div>
      </section>

      {/* Tablo - sipariş listesi */}
      <section className={s.tableSection}>
        <h2 className={s.sectionTitle}>
          {t("admin.latest_orders") || "Latest Orders"}
        </h2>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t("admin.order_id") || "Order"}</th>
                <th>{t("checkout.table_number") || "Table"}</th>
                <th>{t("checkout.order_summary") || "Items"}</th>
                <th>{t("checkout.total") || "Total"}</th>
                <th>{t("admin.status") || "Status"}</th>
                <th>{t("admin.time") || "Time"}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.table}</td>
                  <td>{o.items}</td>
                  <td>₺{o.total}</td>
                  <td>
                    <div className={s.statusCell}>
                      <span
                        className={`${s.statusChip} ${s["status_" + o.status]}`}
                      >
                        {statusLabel(o.status)}
                      </span>
                      <select
                        className={s.statusSelect}
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        <option value="pending">
                          {t("admin.status_pending") || "Beklemede"}
                        </option>
                        <option value="preparing">
                          {t("admin.status_preparing") || "Hazırlanıyor"}
                        </option>
                        <option value="completed">
                          {t("admin.status_completed") || "Tamamlandı"}
                        </option>
                      </select>
                    </div>
                  </td>
                  <td>{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
