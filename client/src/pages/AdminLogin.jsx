import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import s from "./Auth.module.css";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [generalError, setGeneralError] = useState("");
  const from = location.state?.from || "/admin/dashboard";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Geçerli bir e-posta girin.")
        .required(t("auth.fill_all") || "Please fill all fields."),
      password: Yup.string().required(
        t("auth.fill_all") || "Please fill all fields."
      ),
    }),
    onSubmit: (values) => {
      setGeneralError("");

      const normalizedEmail = values.email.trim().toLowerCase();
      const normalizedPassword = values.password.trim();

      if (
        normalizedEmail === "admin@friendsfirst.com" &&
        normalizedPassword === "admin123"
      ) {
        const fakeToken = "jwt-admin-" + Date.now();

        dispatch(
          setCredentials({
            user: { name: "Admin", email: normalizedEmail },
            token: fakeToken,
            isAdmin: true,
          })
        );

        navigate(from, { replace: true });
      } else {
        setGeneralError(t("auth.invalid") || "Invalid admin credentials.");
      }
    },
  });

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={formik.handleSubmit}>
        <h1 className={s.title}>
          {t("admin.login_title") || "Admin Panel Login"}
        </h1>
        <p className={s.subtitle}>
          {t("admin.login_sub") || "Only authorized administrators can log in."}
        </p>

        {/* EMAIL */}
        <div className={s.field}>
          <label htmlFor="email" className={s.label}>
            {t("admin.email") || "Email"}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={s.input}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="admin@friendsfirst.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className={s.error}>{formik.errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className={s.field}>
          <label htmlFor="password" className={s.label}>
            {t("admin.password") || "Password"}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={s.input}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <p className={s.error}>{formik.errors.password}</p>
          )}
        </div>

        {/* GENEL HATA */}
        {generalError && <p className={s.error}>{generalError}</p>}

        <div className={s.actions}>
          <button type="submit" className={s.submitBtn}>
            {t("admin.sign_in") || "Sign In"}
          </button>
        </div>
      </form>
    </main>
  );
}
