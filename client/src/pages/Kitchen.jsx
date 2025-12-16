import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import s from "./Kitchen.module.css";

import { fetchOrders, patchOrderStatus } from "../redux/ordersSlice";

function formatOrderItems(order) {
  const items = order.items;

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

function formatTimeFromISO(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

function isWithinRange(createdAt, range) {
  if (!createdAt) return false;
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return false;

  const now = Date.now();

  if (range === "all") return true;

  if (range === "24h") {
    return now - t <= 24 * 60 * 60 * 1000;
  }

  if (range === "7d") {
    return now - t <= 7 * 24 * 60 * 60 * 1000;
  }

  if (range === "today") {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return t >= d.getTime();
  }

  return true;
}

export default function Kitchen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    list: orders,
    loading,
    error,
    updatingId,
  } = useSelector((state) => state.orders);

  const [statusFilter, setStatusFilter] = useState("active"); 
  const [completedRange, setCompletedRange] = useState("24h"); 
  const [search, setSearch] = useState("");
  const [lastSyncAt, setLastSyncAt] = useState(null);

 
  const lastFpRef = useRef("");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      const action = await dispatch(fetchOrders());
      if (!mounted) return;

      setLastSyncAt(Date.now());

      const list = action?.payload || [];
      const fp = JSON.stringify(
        (Array.isArray(list) ? list : []).map((o) => ({
          id: String(o.id),
          status: o.status,
          table: o.table,
          note: o.note,
          createdAt: o.createdAt,
          updatedAt: o.updatedAt,
          itemsLen: Array.isArray(o.items)
            ? o.items.length
            : String(o.items || "").length,
        }))
      );

      if (fp === lastFpRef.current) return;
      lastFpRef.current = fp;
    };

    run();
    const id = setInterval(run, 8000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [dispatch]);

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

  const filtered = useMemo(() => {
    const base = (orders || []).filter((o) => {
      if (statusFilter === "active") {
        return o.status === "pending" || o.status === "preparing";
      }

      if (statusFilter === "completed") {
        if (o.status !== "completed") return false;
        return isWithinRange(o.createdAt, completedRange);
      }

      return true; 
    });

    
    const sorted = [...base].sort((a, b) => {
      const pr = (s) => (s === "pending" ? 0 : s === "preparing" ? 1 : 2);
      const p = pr(a.status) - pr(b.status);
      if (p !== 0) return p;

      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
    });

    if (!search.trim()) return sorted;

    const q = search.toLowerCase();
    return sorted.filter((o) => {
      const itemsText = formatOrderItems(o);
      const hay = `${o.id} ${o.table} ${
        o.note || ""
      } ${itemsText}`.toLowerCase();
      return hay.includes(q);
    });
  }, [orders, statusFilter, completedRange, search]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(patchOrderStatus({ id, status: newStatus })).catch(() => {});
  };

  const handleManualRefresh = async () => {
    await dispatch(fetchOrders());
    setLastSyncAt(Date.now());
  };

  return (
    <main className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>{t("kitchen.title") || "Kitchen Panel"}</h1>
          <p className={s.subtitle}>
            {t("kitchen.sub") ||
              "Incoming orders. Completed orders will unlock the table."}
          </p>
        </div>

        <button
          className={s.refreshBtn}
          type="button"
          onClick={handleManualRefresh}
          disabled={loading}
        >
          {t("kitchen.refresh") || "Refresh"}
        </button>
      </header>

      <div className={s.syncRow}>
        <span>Auto refresh: 8s</span>
        <span>
          Last sync:{" "}
          {lastSyncAt ? new Date(lastSyncAt).toLocaleTimeString("tr-TR") : "—"}
        </span>
      </div>

      <section className={s.controls}>
        <div className={s.chips}>
          <button
            type="button"
            className={`${s.chip} ${
              statusFilter === "active" ? s.chipActive : ""
            }`}
            onClick={() => setStatusFilter("active")}
          >
            {t("kitchen.active") || "Active"}
          </button>

          <button
            type="button"
            className={`${s.chip} ${
              statusFilter === "completed" ? s.chipActive : ""
            }`}
            onClick={() => setStatusFilter("completed")}
          >
            {t("kitchen.completed") || "Completed"}
          </button>

          <button
            type="button"
            className={`${s.chip} ${
              statusFilter === "all" ? s.chipActive : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            {t("admin.filter_all") || "All"}
          </button>
        </div>

        {/*  Completed sekmesinde range seçimi */}
        {statusFilter === "completed" && (
          <select
            className={s.rangeSelect}
            value={completedRange}
            onChange={(e) => setCompletedRange(e.target.value)}
            title="Completed range"
          >
            <option value="24h">Last 24h</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="all">All</option>
          </select>
        )}

        <input
          className={s.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("kitchen.search") || "Search table, note, items..."}
        />
      </section>

      {loading && (orders?.length || 0) === 0 && (
        <p className={s.info}>Loading orders...</p>
      )}
      {error && !loading && <p className={s.error}>{error}</p>}

      <section className={s.list}>
        {!loading && filtered.length === 0 ? (
          <div className={s.empty}>
            <p>{t("kitchen.empty") || "No orders found."}</p>
          </div>
        ) : (
          filtered.map((o) => {
            const isDone = o.status === "completed";

            return (
              <article
                key={o.id}
                className={`${s.card} ${isDone ? s.cardDone : ""}`}
              >
                <div className={s.cardTop}>
                  <div className={s.left}>
                    <div className={s.tableBadge}>
                      {t("checkout.table_number") || "Table"}: <b>{o.table}</b>
                    </div>

                    <div className={s.meta}>
                      <span className={s.orderId}>#{o.id}</span>
                      <span>{formatTimeFromISO(o.createdAt)}</span>
                    </div>
                  </div>

                  <div className={s.right}>
                    <span
                      className={`${s.statusChip} ${s["status_" + o.status]}`}
                    >
                      {statusLabel(o.status)}
                    </span>

                    <select
                      className={s.statusSelect}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={updatingId === o.id}
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

                    <div className={s.quickBtns}>
                      <button
                        type="button"
                        className={s.quickBtn}
                        disabled={
                          updatingId === o.id || o.status === "preparing"
                        }
                        onClick={() => handleStatusChange(o.id, "preparing")}
                      >
                        Preparing
                      </button>

                      <button
                        type="button"
                        className={s.quickBtnPrimary}
                        disabled={
                          updatingId === o.id || o.status === "completed"
                        }
                        onClick={() => handleStatusChange(o.id, "completed")}
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                </div>

                <div className={s.items}>
                  <div className={s.itemsLabel}>
                    {t("checkout.order_summary") || "Items"}
                  </div>
                  <div className={s.itemsText}>{formatOrderItems(o)}</div>
                </div>

                <div className={s.noteRow}>
                  <div className={s.noteLabel}>
                    {t("checkout.note_optional") || "Note"}
                  </div>
                  <div className={s.noteText}>
                    {o.note && o.note.trim() ? o.note : "—"}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
