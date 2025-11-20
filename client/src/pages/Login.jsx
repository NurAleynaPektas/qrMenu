import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import s from "./Auth.module.css";

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [generalError, setGeneralError] = useState("");

  const from = location.state?.from || "/";

  // Formik + Yup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Geçerli bir e-posta girin.")
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

      const { email, password } = values;

      const raw = window.localStorage.getItem("ff-credentials");
      if (!raw) {
        setGeneralError(
          t("auth.no_account") ||
            "No registered user. Please create an account."
        );
        return;
      }

      let saved;
      try {
        saved = JSON.parse(raw);
      } catch (err) {
        console.error("Credentials parse error:", err);
        setGeneralError(t("auth.error") || "Something went wrong.");
        return;
      }

      if (saved.email !== email || saved.password !== password) {
        setGeneralError(t("auth.invalid") || "Invalid email or password.");
        return;
      }

      const fakeToken = "fake-jwt-token-for-" + saved.email;

      dispatch(
        setCredentials({
          user: { name: saved.name, email: saved.email },
          token: fakeToken,
          isAdmin: false,
        })
      );

      navigate(from, { replace: true });
    },
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("ff-credentials");
      if (!raw) return;

      const saved = JSON.parse(raw);

      if (saved?.email || saved?.password) {
        formik.setValues({
          email: saved.email || "",
          password: saved.password || "",
        });
      }
    } catch (err) {
      console.error("Saved credentials parse error:", err);
    }
  }, []);

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={formik.handleSubmit}>
        <h1 className={s.title}>{t("auth.login") || "Login"}</h1>
        <p className={s.subtitle}>
          {t("auth.login_sub") || "Sign in to continue to the menu and cart."}
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
            placeholder="you@example.com"
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
          />
          {formik.touched.password && formik.errors.password && (
            <p className={s.error}>{formik.errors.password}</p>
          )}
        </div>

        {/* GENEL HATA  */}
        {generalError && <p className={s.error}>{generalError}</p>}

        <div className={s.actions}>
          <button type="submit" className={s.submitBtn}>
            {t("auth.login") || "Login"}
          </button>

          <p className={s.switchText}>
            {t("auth.no_account_q") || "Don't have an account?"}{" "}
            <Link to="/register" className={s.switchLink}>
              {t("auth.register") || "Register"}
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
