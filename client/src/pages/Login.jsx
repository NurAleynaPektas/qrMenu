import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import s from "./Auth.module.css";

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError(t("auth.fill_all") || "Please fill all fields.");
      return;
    }

    const raw = window.localStorage.getItem("ff-credentials");
    if (!raw) {
      setError(
        t("auth.no_account") || "No registered user. Please create an account."
      );
      return;
    }

    let saved;
    try {
      saved = JSON.parse(raw);
    } catch (err) {
      console.error("Credentials parse error:", err);
      setError(t("auth.error") || "Something went wrong.");
      return;
    }

    if (saved.email !== email || saved.password !== password) {
      setError(t("auth.invalid") || "Invalid email or password.");
      return;
    }

    // 🔐 Şimdilik fake JWT token
    const fakeToken = "fake-jwt-token-for-" + saved.email;

    dispatch(
      setCredentials({
        user: { name: saved.name, email: saved.email },
        token: fakeToken,
        isAdmin: false,
      })
    );

    navigate(from, { replace: true });
  };

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={onSubmit}>
        <h1 className={s.title}>{t("auth.login") || "Login"}</h1>
        <p className={s.subtitle}>
          {t("auth.login_sub") || "Sign in to continue to the menu and cart."}
        </p>

        <div className={s.field}>
          <label htmlFor="email" className={s.label}>
            {t("auth.email") || "Email"}
          </label>
          <input
            id="email"
            className={s.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className={s.field}>
          <label htmlFor="password" className={s.label}>
            {t("auth.password") || "Password"}
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
