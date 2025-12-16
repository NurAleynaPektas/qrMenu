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

const SEEN_KEY = "ff-kitchen-seen-order-ids";

function loadSeenIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(set) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

/** Optional beep (user gesture ile unlock) */
let audioCtx = null;
function getAudioCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}
async function unlockAudio() {
  try {
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") await ctx.resume();
  } catch {}
}
function playBeep() {
  try {
    const ctx = getAudioCtx();
    if (ctx.state !== "running") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.05;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    setTimeout(() => osc.stop(), 180);
  } catch {}
}

/** compare fingerprint (liste değişmediyse highlight tetikleme) */
function normalizeForCompare(list) {
  return (list || [])
    .map((o) => ({
      id: String(o.id),
      status: o.status || "",
      table: o.table ?? "",
      note: o.note || "",
      createdAt: o.createdAt || "",
      updatedAt: o.updatedAt || "",
      itemsKey: Array.isArray(o.items)
        ? o.items
            .map(
              (it) =>
                `${it.id}:${it.quantity}:${it.price}:${
                  it.title || it.name || ""
                }`
            )
            .join("|")
        : String(o.items || ""),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
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
  const [search, setSearch] = useState("");
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [highlightIds, setHighlightIds] = useState(() => new Set());
  const [soundOn, setSoundOn] = useState(false);

  // effect dependency fix için: fingerprint ref
  const lastFingerprintRef = useRef("");

  //  sadece ilk yüklemede loading göstermek için
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async (silent = false) => {
      try {
        const action = await dispatch(fetchOrders());
        const list = action?.payload || [];
        if (!mounted) return;

        setLastSyncAt(Date.now());
        if (!initialLoaded) setInitialLoaded(true);
        // liste değişti mi?
        const fp = JSON.stringify(normalizeForCompare(list));
        const changed = fp !== lastFingerprintRef.current;

        // yeni order tespiti 
        if (changed) {
          lastFingerprintRef.current = fp;

          const seen = loadSeenIds();
          const active = list.filter(
            (o) => o.status === "pending" || o.status === "preparing"
          );
          const newOnes = active.filter((o) => !seen.has(o.id));

          if (newOnes.length > 0) {
            if (!silent && soundOn) playBeep();

            setHighlightIds((prev) => {
              const next = new Set(prev);
              newOnes.forEach((o) => next.add(o.id));
              return next;
            });

            setTimeout(() => {
              setHighlightIds((prev) => {
                const next = new Set(prev);
                newOnes.forEach((o) => next.delete(o.id));
                return next;
              });
            }, 6000);

            newOnes.forEach((o) => seen.add(o.id));
            saveSeenIds(seen);
          }
        }
      } catch {
        if (!mounted) return;
        setLastSyncAt(Date.now());
        if (!initialLoaded) setInitialLoaded(true);
      }
    };

   
    run(true);

   
    const id = setInterval(() => run(true), 8000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
    
  }, [dispatch, initialLoaded, soundOn]);

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
      if (statusFilter === "completed") return o.status === "completed";
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
  }, [orders, statusFilter, search]);

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

        <div className={s.headerActions}>
          <button
            className={s.refreshBtn}
            type="button"
            onClick={handleManualRefresh}
            disabled={loading && !initialLoaded}
          >
            {t("kitchen.refresh") || "Refresh"}
          </button>

          <button
            className={s.refreshBtn}
            type="button"
            onClick={async () => {
              await unlockAudio();
              setSoundOn((v) => !v);
            }}
            title="Optional"
          >
            {soundOn ? "Sound: ON" : "Sound: OFF"}
          </button>
        </div>
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

        <input
          className={s.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("kitchen.search") || "Search table, note, items..."}
        />
      </section>

      {!initialLoaded && loading && <p className={s.info}>Loading orders...</p>}
      {error && initialLoaded && <p className={s.error}>{error}</p>}

      <section className={s.list}>
        {initialLoaded && filtered.length === 0 ? (
          <div className={s.empty}>
            <p>{t("kitchen.empty") || "No orders found."}</p>
          </div>
        ) : (
          filtered.map((o) => (
            <article
              key={o.id}
              className={`${s.card} ${
                highlightIds.has(o.id) ? s.cardHighlight : ""
              }`}
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
                      disabled={updatingId === o.id || o.status === "preparing"}
                      onClick={() => handleStatusChange(o.id, "preparing")}
                    >
                      Preparing
                    </button>

                    <button
                      type="button"
                      className={s.quickBtnPrimary}
                      disabled={updatingId === o.id || o.status === "completed"}
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
          ))
        )}
      </section>
    </main>
  );
}
