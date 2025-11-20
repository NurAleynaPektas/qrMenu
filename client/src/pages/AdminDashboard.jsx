import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState, useMemo } from "react";
import s from "./AdminDashboard.module.css";
import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../redux/menuSlice";
import { removeFromCart } from "../redux/cartSlice"; // ✅ sepetten de silmek için

// Mock siparişler
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
  const dispatch = useDispatch();

  const admin = useSelector((state) => state.auth.user);
  const menuItems = useSelector((state) => state.menu.items);

  // 🔥 Orders state
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | preparing | completed
  const [search, setSearch] = useState("");

  // 🔥 Menu form state
  const [editingId, setEditingId] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: "",
    price: "",
    category: "",
    available: true,
  });

  // İstatistikler (orders)
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

  // Filtrelenmiş + arama uygulanmış orders listesi
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) {
        return false;
      }

      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const haystack = `${o.id} ${o.items} ${o.table}`.toLowerCase();

      return haystack.includes(q);
    });
  }, [orders, statusFilter, search]);

  // Orders status güncelleme
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

  // 🔸 Menü formu değişiklikleri
  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔸 Menü formunu resetle
  const resetMenuForm = () => {
    setEditingId(null);
    setMenuForm({
      name: "",
      price: "",
      category: "",
      available: true,
    });
  };

  // 🔸 Menü ekle / güncelle (Redux)
  const handleMenuSubmit = (e) => {
    e.preventDefault();

    const trimmedName = menuForm.name.trim();
    if (!trimmedName) return;

    const priceNumber = Number(menuForm.price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) return;

    if (editingId) {
      // Güncelle
      dispatch(
        updateMenuItem({
          id: editingId,
          changes: {
            name: trimmedName,
            price: priceNumber,
            category: menuForm.category.trim() || "Genel",
            available: menuForm.available,
          },
        })
      );
    } else {
      // Yeni ekle
      dispatch(
        addMenuItem({
          name: trimmedName,
          price: priceNumber,
          category: menuForm.category.trim() || "Genel",
          available: menuForm.available,
        })
      );
    }

    resetMenuForm();
  };

  // 🔸 Edit'e tıklayınca formu doldur
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setMenuForm({
      name: item.name,
      price: item.price,
      category: item.category,
      available: item.available,
    });
  };

  // 🔸 Delete (menü + sepet senkron)
  const handleDeleteClick = (id) => {
    // Menuden sil
    dispatch(deleteMenuItem(id));
    // Sepetten de sil
    dispatch(removeFromCart(id));

    if (editingId === id) {
      resetMenuForm();
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
              "Track orders, tables and menu in one place."}
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

      {/* Filtre barı - Orders */}
      <section className={s.filtersBar}>
        <div className={s.filterChips}>
          <button
            type="button"
            className={`${s.filterChip} ${
              statusFilter === "all" ? s.filterChipActive : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            {t("admin.filter_all") || "All"}
          </button>
          <button
            type="button"
            className={`${s.filterChip} ${
              statusFilter === "pending" ? s.filterChipActive : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            {t("admin.status_pending") || "Pending"}
          </button>
          <button
            type="button"
            className={`${s.filterChip} ${
              statusFilter === "preparing" ? s.filterChipActive : ""
            }`}
            onClick={() => setStatusFilter("preparing")}
          >
            {t("admin.status_preparing") || "Preparing"}
          </button>
          <button
            type="button"
            className={`${s.filterChip} ${
              statusFilter === "completed" ? s.filterChipActive : ""
            }`}
            onClick={() => setStatusFilter("completed")}
          >
            {t("admin.status_completed") || "Completed"}
          </button>
        </div>

        <input
          className={s.searchInput}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            t("admin.search_placeholder") ||
            "Search by order, table or items..."
          }
        />
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className={s.emptyRow}>
                    {t("admin.no_orders") ||
                      "No orders found for the current filter."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.table}</td>
                    <td>{o.items}</td>
                    <td>₺{o.total}</td>
                    <td>
                      <div className={s.statusCell}>
                        <span
                          className={`${s.statusChip} ${
                            s["status_" + o.status]
                          }`}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 🔥 Menü Yönetimi */}
      <section className={s.menuSection}>
        <div className={s.menuHeader}>
          <div>
            <h2 className={s.sectionTitle}>
              {t("admin.menu_management_title") || "Menu Management"}
            </h2>
            <p className={s.menuSubtitle}>
              {t("admin.menu_management_sub") ||
                "Add, edit or disable items on your digital menu."}
            </p>
          </div>
        </div>

        {/* Form - yeni ürün / düzenleme */}
        <form className={s.menuForm} onSubmit={handleMenuSubmit}>
          <div className={s.menuFormRow}>
            <div className={s.menuField}>
              <label className={s.menuLabel}>
                {t("admin.menu_name") || "Name"}
              </label>
              <input
                name="name"
                className={s.menuInput}
                value={menuForm.name}
                onChange={handleMenuChange}
                placeholder="Köfte Menü"
              />
            </div>
            <div className={s.menuField}>
              <label className={s.menuLabel}>
                {t("admin.menu_price") || "Price (₺)"}
              </label>
              <input
                name="price"
                type="number"
                min="1"
                step="1"
                className={s.menuInput}
                value={menuForm.price}
                onChange={handleMenuChange}
                placeholder="250"
              />
            </div>
            <div className={s.menuField}>
              <label className={s.menuLabel}>
                {t("admin.menu_category") || "Category"}
              </label>
              <input
                name="category"
                className={s.menuInput}
                value={menuForm.category}
                onChange={handleMenuChange}
                placeholder="Ana Yemek / Tatlı / İçecek"
              />
            </div>
          </div>

          <div className={s.menuFormRowBottom}>
            <label className={s.menuCheckboxLabel}>
              <input
                type="checkbox"
                name="available"
                checked={menuForm.available}
                onChange={handleMenuChange}
              />
              <span>
                {t("admin.menu_available") || "Show in menu (available)"}
              </span>
            </label>

            <div className={s.menuActions}>
              {editingId && (
                <button
                  type="button"
                  className={s.menuSecondaryBtn}
                  onClick={resetMenuForm}
                >
                  {t("admin.menu_cancel_edit") || "Cancel edit"}
                </button>
              )}
              <button type="submit" className={s.menuPrimaryBtn}>
                {editingId
                  ? t("admin.menu_save_changes") || "Save changes"
                  : t("admin.menu_add_item") || "Add item"}
              </button>
            </div>
          </div>
        </form>

        {/* Menü tablosu */}
        <div className={s.menuTableWrap}>
          <table className={s.menuTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("admin.menu_name") || "Name"}</th>
                <th>{t("admin.menu_price") || "Price"}</th>
                <th>{t("admin.menu_category") || "Category"}</th>
                <th>{t("admin.menu_status") || "Status"}</th>
                <th>{t("admin.menu_actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className={s.emptyRow}>
                    {t("admin.menu_empty") ||
                      "No menu items yet. Add your first dish above."}
                  </td>
                </tr>
              ) : (
                menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>₺{item.price}</td>
                    <td>{item.category}</td>
                    <td>
                      <span
                        className={
                          item.available ? s.menuStatusOn : s.menuStatusOff
                        }
                      >
                        {item.available
                          ? t("admin.menu_available_short") || "Active"
                          : t("admin.menu_unavailable_short") || "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className={s.menuRowActions}>
                        <button
                          type="button"
                          className={s.menuRowEdit}
                          onClick={() => handleEditClick(item)}
                        >
                          {t("admin.menu_edit") || "Edit"}
                        </button>
                        <button
                          type="button"
                          className={s.menuRowDelete}
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          {t("admin.menu_delete") || "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
