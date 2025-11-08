import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import s from "./Auth.module.css";

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError(t("auth.fill_all") || "Please fill all fields.");
      return;
    }

    if (password.length < 4) {
      setError(
        t("auth.password_short") || "Password must be at least 4 chars."
      );
      return;
    }

    // Fake kayıt (sadece localStorage)
    const creds = { name, email, password };
    window.localStorage.setItem("ff-credentials", JSON.stringify(creds));

    dispatch(setUser({ name, email }));
    navigate("/", { replace: true });
  };

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={onSubmit}>
        <h1 className={s.title}>{t("auth.register") || "Register"}</h1>
        <p className={s.subtitle}>
          {t("auth.register_sub") ||
            "Create an account to save your orders and preferences."}
        </p>

        <div className={s.field}>
          <label htmlFor="name" className={s.label}>
            {t("auth.name") || "Name"}
          </label>
          <input
            id="name"
            className={s.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Morgan"
          />
        </div>

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
            {t("auth.register") || "Register"}
          </button>

          <p className={s.switchText}>
            {t("auth.have_account") || "Already have an account?"}{" "}
            <Link to="/login" className={s.switchLink}>
              {t("auth.login") || "Login"}
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
