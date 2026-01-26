import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import s from "./Auth.module.css";
import { toastSuccess, toastError } from "../utils/toast";
import Loader from "../components/Loader";

import { signInWithEmailAndPassword, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/config";

const LAST_EMAIL_KEY = "ff-last-staff-email";

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || "/checkout";

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("auth.email_invalid") || "Please enter a valid email.")
        .required(t("auth.fill_all") || "Please fill all fields."),
      password: Yup.string()
        .min(
          4,
          t("auth.password_short") || "Password must be at least 4 characters.",
        )
        .required(t("auth.fill_all") || "Please fill all fields."),
    }),
    onSubmit: async (values) => {
      setGeneralError("");
      setIsSubmitting(true);

      try {
        const email = values.email.trim().toLowerCase();
        const password = values.password.trim();

        const cred = await signInWithEmailAndPassword(auth, email, password);
        const user = cred.user;

        const token = await user.getIdToken();

        let finalRole = "staff";
        try {
          const tokenResult = await getIdTokenResult(user);
          const claimRole = tokenResult?.claims?.role;
          if (typeof claimRole === "string" && claimRole.trim()) {
            finalRole = claimRole.trim();
          }
        } catch {
          finalRole = "staff";
        }

        if (finalRole !== "staff") {
          throw new Error("Bu hesap personel yetkisine sahip değil.");
        }

        dispatch(
          setCredentials({
            user: {
              name: user.displayName || "Staff",
              email: user.email,
            },
            token,
            role: "staff",
            isAdmin: false,
          }),
        );

        try {
          window.localStorage.setItem(LAST_EMAIL_KEY, email);
        } catch {}

        toastSuccess(t("staff.login_success") || "Personel girişi başarılı");
        setTimeout(() => navigate(from, { replace: true }), 200);
      } catch (err) {
        const msg =
          err?.message || t("auth.invalid") || "Email veya şifre hatalı";
        setGeneralError(msg);
        toastError(msg);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_EMAIL_KEY);
      if (raw) formik.setFieldValue("email", raw);
    } catch {}
  
  }, []);

  return (
    <>
      {isSubmitting && <Loader />}

      <main className={s.page}>
        <form className={s.card} onSubmit={formik.handleSubmit}>
          <h1 className={s.title}>
            {t("staff.login_title") || "Personel Girişi"}
          </h1>
          <p className={s.subtitle}>
            {t("staff.login_sub") || "Sipariş oluşturmak için giriş yapın."}
          </p>

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
              onChange={(e) => {
                formik.handleChange(e);
                setGeneralError("");
              }}
              onBlur={formik.handleBlur}
              placeholder="staff@restaurant.com"
              autoComplete="email"
              disabled={isSubmitting}
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
              onChange={(e) => {
                formik.handleChange(e);
                setGeneralError("");
              }}
              onBlur={formik.handleBlur}
              placeholder="••••••"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={s.error}>{formik.errors.password}</p>
            )}
          </div>

          {generalError && <p className={s.error}>{generalError}</p>}

          <div className={s.actions}>
            <button
              type="submit"
              className={s.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("loader.loading") || "Loading..."
                : t("staff.login_btn") || "Personel Girişi"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
