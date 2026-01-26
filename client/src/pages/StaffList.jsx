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
      if (!token) throw new Error("Admin oturumu bulunamadı.");

      const res = await fetch(`${base}/api/staff`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.message || "Liste alınamadı.");

      setStaff(Array.isArray(data) ? data : []);
    } catch (e) {
      iziToast.error({
        title: "Hata",
        message: String(e?.message || e || "Hata"),
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
    iziToast.info({ title: "OK", message: "Liste yenilendi" });
  };

  const handleDelete = async (uid) => {
    const ok = window.confirm("Bu personeli silmek istiyor musun?");
    if (!ok) return;

    try {
      const token = getAdminToken();
      if (!token) throw new Error("Admin oturumu bulunamadı.");

      const res = await fetch(`${base}/api/staff/${uid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Silme işlemi başarısız.");

      setStaff((prev) => prev.filter((u) => u.uid !== uid));
      iziToast.success({ title: "Silindi", message: "Personel silindi" });
    } catch (e) {
      iziToast.error({
        title: "Hata",
        message: String(e?.message || e || "Hata"),
      });
    }
  };

  return (
    <main className={s.page}>
      <header className={s.header}>
        <div>
          <h1 className={s.title}>{t("staff.list_title") || "Personeller"}</h1>
          <p className={s.sub}>
            {t("staff.list_sub") ||
              "Oluşturulan personelleri görüntüle ve yönet."}
          </p>
        </div>

        <div className={s.headerActions}>
          <button
            className={s.primaryBtn}
            type="button"
            onClick={() => navigate("/admin/staff/create")}
          >
            {t("staff.create_btn") || "Personel Oluştur"}
          </button>

          <button
            className={s.primaryBtn}
            type="button"
            onClick={() => navigate("/admin/dashboard")}
          >
            {t("staff.back_admin") || "Admin Paneline Dön"}
          </button>
        </div>
      </header>

      <section className={s.toolbar}>
        <input
          className={s.search}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("staff.search") || "İsim / Email ara..."}
        />

        <button
          className={s.secondaryBtn}
          type="button"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "..." : t("staff.refresh") || "Yenile"}
        </button>
      </section>

      <section className={s.tableWrap}>
        {loading ? (
          <p className={s.empty}>{t("loader.loading") || "Loading..."}</p>
        ) : filtered.length === 0 ? (
          <p className={s.empty}>
            {staff.length === 0
              ? t("staff.empty") || "Henüz personel yok. Personel oluştur."
              : t("staff.no_match") || "Aramaya uygun personel bulunamadı."}
          </p>
        ) : (
          <table className={s.table}>
            <thead>
              <tr>
                <th>{t("staff.col_name") || "Ad"}</th>
                <th>{t("staff.col_email") || "Email"}</th>
                <th>{t("staff.col_actions") || "İşlemler"}</th>
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
                        {t("staff.delete") || "Sil"}
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
