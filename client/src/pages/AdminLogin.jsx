import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import s from "./Auth.module.css";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // AdminRoute'tan geldiyse buraya düşecek
  const from = location.state?.from || "/admin/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    // 🔐 Şimdilik hard-coded admin
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

      // AdminRoute'un yönlendirdiği hedefe geri dön
      navigate(from, { replace: true });
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={handleSubmit}>
        <h1 className={s.title}>Admin Panel Login</h1>
        <p className={s.subtitle}>Only authorized administrators can log in.</p>

        <div className={s.field}>
          <label htmlFor="email" className={s.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={s.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@friendsfirst.com"
          />
        </div>

        <div className={s.field}>
          <label htmlFor="password" className={s.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className={s.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </div>

        {error && <p className={s.error}>{error}</p>}

        <div className={s.actions}>
          <button type="submit" className={s.submitBtn}>
            Login
          </button>
        </div>
      </form>
    </main>
  );
}
