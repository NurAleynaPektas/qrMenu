import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import s from "./StaffList.module.css";

const STAFF_KEY = "ff-staff-credentials";

function safeReadStaff() {
  try {
    const raw = window.localStorage.getItem(STAFF_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function safeWriteStaff(list) {
  window.localStorage.setItem(STAFF_KEY, JSON.stringify(list));
}

export default function StaffList() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [q, setQ] = useState("");

  // ilk yüklemede localStorage'dan çek
  useEffect(() => {
    setStaff(safeReadStaff());
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
    setStaff(safeReadStaff());
    iziToast.info({ title: "OK", message: "Liste yenilendi" });
  };

  const handleDelete = (email) => {
    const ok = window.confirm("Bu personeli silmek istiyor musun?");
    if (!ok) return;

    const current = safeReadStaff();
    const next = current.filter(
      (u) => String(u.email).toLowerCase() !== String(email).toLowerCase()
    );

    safeWriteStaff(next);
    setStaff(next);

    iziToast.success({ title: "Silindi", message: "Personel silindi" });
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
        >
          {t("staff.refresh") || "Yenile"}
        </button>
      </section>

      <section className={s.tableWrap}>
        {filtered.length === 0 ? (
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
                <tr key={u.email}>
                  <td>{u.name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td>
                    <div className={s.actions}>
                      <button
                        className={s.dangerBtn}
                        type="button"
                        onClick={() => handleDelete(u.email)}
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
