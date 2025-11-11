import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import s from "./Auth.module.css";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

   
    if (email === "admin@friendsfirst.com" && password === "admin123") {
      const fakeToken = "jwt-admin-" + Date.now();

      dispatch(
        setCredentials({
          user: { name: "Admin", email },
          token: fakeToken,
          isAdmin: true,
        })
      );

      navigate("/admin/dashboard");
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
