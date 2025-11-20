import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import s from "./Auth.module.css";

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(
        t("auth.fill_all") || "Please fill all fields."
      ),
      email: Yup.string()
        .email("Geçerli bir e-posta girin.")
        .required(t("auth.fill_all") || "Please fill all fields."),
      password: Yup.string()
        .min(
          4,
          t("auth.password_short") || "Password must be at least 4 chars."
        )
        .required(t("auth.fill_all") || "Please fill all fields."),
    }),
    onSubmit: (values) => {
      const { name, email, password } = values;
      const creds = { name, email, password };
      window.localStorage.setItem("ff-credentials", JSON.stringify(creds));

      const fakeToken = "fake-jwt-token-for-" + email;

      dispatch(
        setCredentials({
          user: { name, email },
          token: fakeToken,
          isAdmin: false,
        })
      );

      navigate("/", { replace: true });
    },
  });

  return (
    <main className={s.page}>
      <form className={s.card} onSubmit={formik.handleSubmit}>
        <h1 className={s.title}>{t("auth.register") || "Register"}</h1>
        <p className={s.subtitle}>
          {t("auth.register_sub") ||
            "Create an account to save your orders and preferences."}
        </p>

        {/* NAME */}
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
            placeholder="Alex Morgan"
          />
          {formik.touched.name && formik.errors.name && (
            <p className={s.error}>{formik.errors.name}</p>
          )}
        </div>

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
            onChange={formik.handleChange}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <p className={s.error}>{formik.errors.password}</p>
          )}
        </div>

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
