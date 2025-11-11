import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setCredentials } from "../redux/authSlice";
import s from "./Auth.module.css";

export default function AdminLogin() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/admin/dashboard";

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("auth.fill_all") || "Please fill all fields.");
      return;
    }

  
    const ADMIN_EMAIL = "admin@friendsfirst.com";
    const ADMIN_PASS = "admin123";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
      setError(t("auth.invalid") || "Invalid email or password.");
      return;
    }

    const fakeToken = "fake-admin-jwt-token";

    dispatch(
      setCredentials({
        user: { name: "Admin", email: ADMIN_EMAIL },
        token: fakeToken,
        isAdmin: true,
      })
    );

    navigate(from, { replace: true });
  };

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={onSubmit}>
        <h1 className={s.title}>
          {t("admin.login_title") || "Admin Panel Login"}
        </h1>
        <p className={s.subtitle}>
          {t("auth.login_sub") || "Sign in to continue to the admin dashboard."}
        </p>

        <div className={s.field}>
          <label htmlFor="email" className={s.label}>
            {t("admin.email") || "Email"}
          </label>
          <input
            id="email"
            className={s.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@friendsfirst.com"
          />
        </div>

        <div className={s.field}>
          <label htmlFor="password" className={s.label}>
            {t("admin.password") || "Password"}
          </label>
          <input
            id="password"
            className={s.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </div>

        {error && <p className={s.error}>{error}</p>}

        <div className={s.actions}>
          <button type="submit" className={s.submitBtn}>
            {t("admin.sign_in") || "Sign In"}
          </button>
        </div>
      </form>
    </main>
  );
}
