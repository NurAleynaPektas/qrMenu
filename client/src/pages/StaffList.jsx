import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import s from "./StaffList.module.css";

function getAdminToken() {
  try {
    const raw = window.localStorage.getItem("ff-auth");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token || "";
  } catch {
    return "";
  }
}

export default function StaffList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      if (!token)
        throw new Error(t("admin.session_missing") || "Session missing");

      const res = await fetch(`${base}/api/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok)
        throw new Error(data?.message || t("staff.fetch_failed") || "Failed");

      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      iziToast.error({
        title: t("common.error_title") || "Error",
        message: String(e?.message || e || t("common.error_title") || "Error"),
      });
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return staff;

    return staff.filter((u) => {
      const hay = `${u.name || ""} ${u.email || ""}`.toLowerCase();
      return hay.includes(query);
    });
  }, [staff, q]);

  const handleRefresh = () => {
    fetchStaff();
    iziToast.info({
      title: "OK",
      message: t("staff.refreshed_toast") || "List refreshed",
    });
  };

  const handleDelete = async (uid) => {
    const ok = window.confirm(
      t("staff.confirm_delete") || "Do you want to delete this staff member?",
    );
    if (!ok) return;

    try {
      const token = getAdminToken();
      if (!token)
        throw new Error(t("admin.session_missing") || "Session missing");

      const res = await fetch(`${base}/api/staff/${uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data?.message || t("staff.delete_failed") || "Delete failed",
        );

      setStaff((prev) => prev.filter((u) => u.uid !== uid));
      iziToast.success({
        title: t("staff.deleted_title") || "Deleted",
        message: t("staff.deleted_toast") || "Staff deleted",
      });
    } catch (e) {
      iziToast.error({
        title: t("common.error_title") || "Error",
        message: String(e?.message || e || t("common.error_title") || "Error"),
      });
    }
  };

  return (
    <main className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>{t("staff.list_title") || "Staff"}</h1>
          <p className={s.sub}>{t("staff.list_sub") || "View staff."}</p>
        </div>

        <div className={s.headerActions}>
          <button
            className={s.primaryBtn}
            type="button"
            onClick={() => navigate("/admin/staff/create")}
          >
            {t("staff.create_btn") || "Create Staff"}
          </button>

          <button
            className={s.primaryBtn}
            type="button"
            onClick={() => navigate("/admin/dashboard")}
          >
            {t("staff.back_admin") || "Back to Admin Panel"}
          </button>
        </div>
      </header>

      <section className={s.toolbar}>
        <input
          className={s.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("staff.search") || "Search by name / email..."}
        />

        <button
          className={s.secondaryBtn}
          type="button"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading
            ? t("common.loading_dots") || "..."
            : t("staff.refresh") || "Refresh"}
        </button>
      </section>

      <section className={s.tableWrap}>
        {loading ? (
          <p className={s.empty}>
            {t("common.loading") || t("loader.loading") || "Loading..."}
          </p>
        ) : filtered.length === 0 ? (
          <p className={s.empty}>
            {staff.length === 0
              ? t("staff.empty") || "No staff yet."
              : t("staff.no_match") || "No match."}
          </p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t("staff.col_name") || "Name"}</th>
                <th>{t("staff.col_email") || "Email"}</th>
                <th>{t("staff.col_actions") || "Actions"}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.uid}>
                  <td>{u.name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td>
                    <div className={s.actions}>
                      <button
                        className={s.dangerBtn}
                        type="button"
                        onClick={() => handleDelete(u.uid)}
                      >
                        {t("staff.delete") || "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
