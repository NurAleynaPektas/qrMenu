import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import s from "./Auth.module.css";
import { toastSuccess, toastError } from "../utils/toast";

function getAdminToken() {
  try {
    const raw = window.localStorage.getItem("ff-auth");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token || "";
  } catch {
    return "";
  }
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string().required(
        t("auth.fill_all") || "Please fill all fields.",
      ),
      email: Yup.string()
        .email(t("staff.email_invalid") || "Geçerli bir e-posta girin.")
        .required(t("auth.fill_all") || "Please fill all fields."),
      password: Yup.string()
        .min(
          4,
          t("auth.password_short") || "Password must be at least 4 chars.",
        )
        .required(t("auth.fill_all") || "Please fill all fields."),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const name = values.name.trim();
        const email = values.email.trim().toLowerCase();
        const password = values.password.trim();

        const token = getAdminToken();

        if (!token) {
          toastError(
            "Admin oturumu bulunamadı. Lütfen tekrar admin giriş yap.",
          );
          return;
        }

        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";

        const res = await fetch(`${base}/api/staff/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            data?.message ||
              t("staff.create_failed") ||
              "Personel oluşturulamadı.",
          );
        }

        toastSuccess(t("staff.created") || "Personel hesabı oluşturuldu.");
        resetForm();
        navigate("/admin/dashboard", { replace: true });
      } catch (err) {
        toastError(String(err?.message || err || "Hata"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={formik.handleSubmit}>
        <h1 className={s.title}>
          {t("staff.register_title") || "Personel Oluştur"}
        </h1>
        <p className={s.subtitle}>
          {t("staff.register_sub") ||
            "Garson/personel hesabı ekleyin (sadece admin)."}
        </p>

        <div className={s.field}>
          <label htmlFor="name" className={s.label}>
            {t("auth.name") || "Name"}
          </label>
          <input
            id="name"
            name="name"
            className={s.input}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Ahmet Yılmaz"
          />
          {formik.touched.name && formik.errors.name && (
            <p className={s.error}>{formik.errors.name}</p>
          )}
        </div>

        <div className={s.field}>
          <label htmlFor="email" className={s.label}>
            {t("auth.email") || "Email"}
          </label>
          <input
            id="email"
            name="email"
            className={s.input}
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="staff@restaurant.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className={s.error}>{formik.errors.email}</p>
          )}
        </div>

        <div className={s.field}>
          <label htmlFor="password" className={s.label}>
            {t("auth.password") || "Password"}
          </label>
          <input
            id="password"
            name="password"
            className={s.input}
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <p className={s.error}>{formik.errors.password}</p>
          )}
        </div>

        <div className={s.actions}>
          <button
            type="submit"
            className={s.submitBtn}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? t("loader.loading") || "Loading..."
              : t("staff.register_btn") || "Personel Oluştur"}
          </button>

          <button
            type="button"
            className={s.switchLink}
            onClick={() => navigate("/admin/dashboard")}
            style={{ marginTop: 10 }}
          >
            {t("staff.back_admin") || "Admin Paneline Dön"}
          </button>
        </div>
      </form>
    </main>
  );
}
