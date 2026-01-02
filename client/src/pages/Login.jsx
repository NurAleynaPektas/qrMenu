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

const STAFF_KEY = "ff-staff-credentials";
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
          t("auth.password_short") || "Password must be at least 4 characters."
        )
        .required(t("auth.fill_all") || "Please fill all fields."),
    }),
    onSubmit: (values) => {
      setGeneralError("");
      setIsSubmitting(true);

      try {
        const email = values.email.trim().toLowerCase();
        const password = values.password.trim();


        let staffList = [];
        try {
          if (typeof window === "undefined") throw new Error("No window");
          const raw = window.localStorage.getItem(STAFF_KEY);
          staffList = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(staffList)) staffList = [];
        } catch (err) {
          console.error("Staff list parse error:", err);
          staffList = [];
        }

        if (staffList.length === 0) {
          const msg =
            t("staff.no_account") ||
            "No registered staff found. Please ask admin to create a staff account.";
          setGeneralError(msg);
          toastError(
            t("staff.no_account_toast") || "Kayıtlı personel bulunamadı"
          );
          setIsSubmitting(false);
          return;
        }

        //  email ile personeli bul
        const staff = staffList.find(
          (u) =>
            String(u.email || "")
              .trim()
              .toLowerCase() === email
        );

        if (!staff) {
          const msg = t("auth.invalid") || "Invalid email or password.";
          setGeneralError(msg);
          toastError(t("staff.invalid_toast") || "Email veya şifre hatalı");
          setIsSubmitting(false);
          return;
        }

        const savedPass = String(staff.password || "").trim();
        if (savedPass !== password) {
          const msg = t("auth.invalid") || "Invalid email or password.";
          setGeneralError(msg);
          toastError(t("staff.invalid_toast") || "Email veya şifre hatalı");
          setIsSubmitting(false);
          return;
        }

        const fakeToken = "jwt-staff-" + Date.now();

        dispatch(
          setCredentials({
            user: { name: staff.name || "Staff", email: staff.email },
            token: fakeToken,
            role: "staff",
            isAdmin: false,
          })
        );

        // Email’i kaydet
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(LAST_EMAIL_KEY, email);
          }
        } catch {
          
        }

        toastSuccess(t("staff.login_success") || "Personel girişi başarılı");

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 250);
      } catch (e) {
        console.error(e);
        toastError(t("auth.error") || "Bir hata oluştu");
        setIsSubmitting(false);
      }
    },
  });

  //  Email autofill 
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(LAST_EMAIL_KEY);
      if (!raw) return;
      formik.setFieldValue("email", raw);
    } catch {
 
    }

  }, []);

  return (
    <>
    
      {isSubmitting && <Loader />}

      <main className={s.page}>
        <form
          className={s.card}
          onSubmit={(e) => {
            formik.handleSubmit(e);
          }}
        >
          <h1 className={s.title}>
            {t("staff.login_title") || "Personel Girişi"}
          </h1>
          <p className={s.subtitle}>
            {t("staff.login_sub") || "Sipariş oluşturmak için giriş yapın."}
          </p>

          {/* EMAIL */}
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

          {/* PASSWORD */}
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
