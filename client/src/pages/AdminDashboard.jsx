import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import s from "./AdminDashboard.module.css";
import "izitoast/dist/css/iziToast.min.css";
import iziToast from "izitoast";

import {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../redux/menuSlice";
import { removeFromCart } from "../redux/cartSlice";
import { fetchOrders, patchOrderStatus } from "../redux/ordersSlice";

function formatOrderItems(order) {
  const items = order?.items;

  if (Array.isArray(items)) {
    return items
      .map((it) => {
        const label = it.title || it.name || "Item";
        return `${label} x${it.quantity}`;
      })
      .join(", ");
  }

  if (typeof items === "string") return items;
  return "";
}

function calcOrderTotal(order) {
  const items = order?.items;
  if (!Array.isArray(items)) return 0;

  return items.reduce((sum, it) => {
    const price = Number(it.price) || 0;
    const qty = Number(it.quantity) || 0;
    return sum + price * qty;
  }, 0);
}

function formatTimeFromISO(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const admin = useSelector((state) => state.auth.user);
  const menuItems = useSelector((state) => state.menu.items) || [];

  const {
    list: orders = [],
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.orders);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: "",
    price: "",
    category: "",
    available: true,
  });

  const [imgFile, setImgFile] = useState(null);
  const fileInputRef = useRef(null);

  // Orders çek
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const CATEGORY_OPTIONS = [
    { value: "MAIN", label: t("admin.cat_main") || "Ana Yemek" },
    { value: "DRINK", label: t("admin.cat_drink") || "İçecek" },
    { value: "APPETIZER", label: t("admin.cat_appetizer") || "Aperatif" },
    { value: "SOUPE", label: t("admin.cat_soupes") || "Çorba" },
    { value: "SALAD", label: t("admin.cat_salads") || "Salata" },
    { value: "DESSERT", label: t("admin.cat_dessert") || "Tatlı" },
  ];

  const categoryLabel = (cat) => {
    switch (cat) {
      case "MAIN":
        return t("admin.cat_main") || "Ana Yemek";
      case "DRINK":
        return t("admin.cat_drink") || "İçecek";
      case "APPETIZER":
        return t("admin.cat_appetizer") || "Aperatif";
      case "DESSERT":
        return t("admin.cat_dessert") || "Tatlı";
      case "SOUPE":
        return t("admin.cat_soupes") || "Çorba";
      case "SALAD":
        return t("admin.cat_salads") || "Salata";
      default:
        return cat || "-";
    }
  };

  const { totalOrders, pendingCount, completedCount, totalRevenue } =
    useMemo(() => {
      const totalOrders = orders.length;
      const pendingCount = orders.filter((o) => o.status === "pending").length;
      const completedCount = orders.filter(
        (o) => o.status === "completed"
      ).length;
      const totalRevenue = orders.reduce(
        (sum, o) => sum + calcOrderTotal(o),
        0
      );
      return { totalOrders, pendingCount, completedCount, totalRevenue };
    }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!search.trim()) return true;

      const q = search.toLowerCase();
      const itemsText = formatOrderItems(o);

      const haystack = `${o.id} ${itemsText} ${o.table} ${
        o.note || ""
      }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await dispatch(patchOrderStatus({ id, status: newStatus })).unwrap();
      iziToast.success({
        title: "Başarılı",
        message: "Sipariş durumu güncellendi",
      });
    } catch (errMsg) {
      iziToast.error({
        title: "Hata",
        message: String(errMsg || "Sipariş durumu güncellenemedi"),
      });
    }
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

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetMenuForm = () => {
    setEditingId(null);
    setMenuForm({ name: "", price: "", category: "", available: true });
    setImgFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImgFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImgFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleMenuSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = menuForm.name.trim();
    if (!trimmedName) {
      iziToast.warning({ title: "Uyarı", message: "Ürün adı boş olamaz" });
      return;
    }

    const priceNumber = Number(menuForm.price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      iziToast.warning({ title: "Uyarı", message: "Fiyat geçersiz" });
      return;
    }

    const categoryCode = menuForm.category || "OTHER";

    const formData = new FormData();
    formData.append("name", trimmedName);
    formData.append("price", priceNumber);
    formData.append("category", categoryCode);
    formData.append("available", menuForm.available ? "true" : "false");
    if (imgFile) formData.append("img", imgFile);

    try {
      if (editingId) {
        await dispatch(
          updateMenuItem({ id: editingId, changes: formData })
        ).unwrap();
        iziToast.success({ title: "Başarılı", message: "Ürün güncellendi" });
      } else {
        await dispatch(addMenuItem(formData)).unwrap();
        iziToast.success({ title: "Başarılı", message: "Ürün eklendi" });
      }
      resetMenuForm();
    } catch (errMsg) {
      iziToast.error({
        title: "Hata",
        message: String(errMsg || "İşlem başarısız"),
      });
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setMenuForm({
      name: item.name,
      price: item.price,
      category: item.category || "",
      available: item.available,
    });
    setImgFile(null);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteMenuItem(id)).unwrap();
      dispatch(removeFromCart(id));
      if (editingId === id) resetMenuForm();
      iziToast.success({ title: "Silindi", message: "Ürün silindi" });
    } catch (errMsg) {
      iziToast.error({
        title: "Hata",
        message: String(errMsg || "Silme işlemi başarısız"),
      });
    }
  };

  return (
    <main className={s.page}>
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

      <section className={s.tableSection}>
        <h2 className={s.sectionTitle}>
          {t("admin.latest_orders") || "Latest Orders"}
        </h2>

        {ordersLoading && <p className={s.infoText}>Loading orders...</p>}
        {ordersError && !ordersLoading && (
          <p className={s.errorText}>{ordersError}</p>
        )}

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t("admin.order_id") || "Order"}</th>
                <th>{t("checkout.table_number") || "Table"}</th>
                <th>{t("checkout.order_summary") || "Items"}</th>
                <th>{t("checkout.total") || "Total"}</th>
                <th>{t("checkout.note_optional") || "Note"}</th>
                <th>{t("admin.status") || "Status"}</th>
                <th>{t("admin.staff") || "Staff"}</th>
                <th>{t("admin.time") || "Time"}</th>
              </tr>
            </thead>

            <tbody>
              {!ordersLoading && filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className={s.emptyRow}>
                    {" "}
                    {t("admin.no_orders") ||
                      "No orders found for the current filter."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.table}</td>
                    <td>{formatOrderItems(o)}</td>
                    <td>₺{calcOrderTotal(o)}</td>
                    <td>{o.note && o.note.trim() ? o.note : "—"}</td>
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
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
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
                    <td>{o.staffName ? o.staffName : "—"}</td>
                    <td>{formatTimeFromISO(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

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
              <select
                name="category"
                className={s.menuInput}
                value={menuForm.category}
                onChange={handleMenuChange}
              >
                <option value="">
                  {t("admin.menu_category_placeholder") || "Kategori seçin"}
                </option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className={s.menuUpload}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className={s.menuUploadContent}>
              <p className={s.menuUploadText}>{t("admin.menu_upload_label")}</p>

              {imgFile && (
                <p className={s.menuUploadFileName}>
                  {t("admin.menu_upload_selected", { file: imgFile.name })}
                </p>
              )}

              <button type="button" className={s.menuUploadButton}>
                {t("admin.menu_upload_btn")}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={s.menuUploadInput}
            />
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
                    <td>{categoryLabel(item.category)}</td>
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
        <div className={s.personel}>
          <p className={s.sectionTitle}>
            {t("admin.staffPlace") || "Personel"}
          </p>

          <div className={s.personelActions}>
            <button
              type="button"
              className={s.menuPrimaryBtn}
              onClick={() => navigate("/admin/staff/create")}
            >
              {t("admin.staff_create_btn") || "Personel Oluştur"}
            </button>

            <button
              type="button"
              className={s.menuPrimaryBtn}
              onClick={() => navigate("/admin/staff")}
            >
              {t("admin.staffSee") || "Personel Listesi"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
