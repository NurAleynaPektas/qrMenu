import React, { useEffect, useRef, useState } from "react";
import s from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { LogOut } from "lucide-react";
import { toastSuccess } from "../utils/toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const langRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, role } = useSelector((state) => state.auth);
  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isKitchen = role === "kitchen"; 

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setLangOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = (i18n.language || "en").toUpperCase().slice(0, 2);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("ff-auth");
      window.localStorage.removeItem("ff-user");
    }

    dispatch(logout());
    toastSuccess(t("auth.logout") || "Logged out");
    setOpen(false);
    navigate("/");
  };

  return (
    <header className={s.navbar}>
      <Link className={s.navbarLogo} to="/" onClick={() => setOpen(false)}>
        {t("brand")}
      </Link>

      <nav className={`${s.navbarRight} ${open ? s.showMenu : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          {t("nav.home")}
        </Link>

        <Link to="/menu" onClick={() => setOpen(false)}>
          {t("nav.menu")}
        </Link>

        {/* Cart sadece STAFF */}
        {isStaff && (
          <Link to="/cart" onClick={() => setOpen(false)}>
            {t("nav.my_cart")}
          </Link>
        )}

        {/*  Kitchen link */}
        {isKitchen && (
          <Link
            to="/kitchen"
            onClick={() => setOpen(false)}
            className={s.adminLink}
          >
            {t("nav.kitchen_panel") || "Kitchen Panel"}
          </Link>
        )}

        {/* Admin link */}
        {isAdmin && (
          <Link
            to="/admin/dashboard"
            onClick={() => setOpen(false)}
            className={s.adminLink}
          >
            {t("nav.admin_panel") || "Admin Panel"}
          </Link>
        )}

        {/* Auth alanı */}
        <div className={s.authArea}>
          {user ? (
            <>
              <span className={s.userName}>{user.name || user.email}</span>
              <button
                className={s.logoutIconBtn}
                onClick={handleLogout}
                aria-label={t("auth.logout") || "Logout"}
                title={t("auth.logout") || "Logout"}
              >
                <LogOut size={20} strokeWidth={2.2} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={s.authLinkAccent}
              onClick={() => setOpen(false)}
            >
              {t("staff.login_btn") || "Personel Girişi"}
            </Link>
          )}
        </div>

        {/* Dil seçimi */}
        <div className={s.langMenuWrap} ref={langRef}>
          <button
            className={s.langToggle}
            onClick={() => setLangOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={langOpen}
            aria-label="Select language"
            title="Language"
          >
            <span className={s.globe} aria-hidden>
              🌐
            </span>
            <span className={s.langCode}>{current}</span>
          </button>

          <ul
            className={`${s.langMenu} ${langOpen ? s.showLangMenu : ""}`}
            role="menu"
          >
            <li role="menuitem">
              <button className={s.langItem} onClick={() => changeLang("tr")}>
                {t("nav.lang_tr")}
              </button>
            </li>
            <li role="menuitem">
              <button className={s.langItem} onClick={() => changeLang("en")}>
                {t("nav.lang_en")}
              </button>
            </li>
            <li role="menuitem">
              <button className={s.langItem} onClick={() => changeLang("fr")}>
                {t("nav.lang_fr")}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <button
        className={s.burger}
        onClick={() => setOpen(!open)}
        aria-label="menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
};

export default Navbar;
