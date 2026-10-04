import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, Menu, X, Globe2 } from "lucide-react";

import s from "./Navbar.module.css";
import { logout } from "../redux/authSlice";
import { toastSuccess } from "../utils/toast";
import Loader from "../components/Loader";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { t, i18n } = useTranslation();

  const langRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, role } = useSelector((state) => state.auth);

  const isAdmin = role === "admin";
  const isStaff = role === "staff";
  const isKitchen = role === "kitchen";

  const current = (i18n.language || "en").toUpperCase().slice(0, 2);

  const isActive = (path) => location.pathname === path;

  const closeMenus = () => {
    setOpen(false);
    setLangOpen(false);
  };

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);

    closeMenus();
  };

  useEffect(() => {
    const onClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setLoggingOut(true);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("ff-auth");
        window.localStorage.removeItem("ff-user");
      }
    } catch {
      // ignore
    }

    dispatch(logout());

    toastSuccess(t("auth.logout"));

    closeMenus();

    setTimeout(() => {
      navigate("/", { replace: true });
      setLoggingOut(false);
    }, 250);
  };

  return (
    <>
      {loggingOut && <Loader />}

      <header className={s.navbar}>
        {/* ===============================================
            BRAND
        =============================================== */}

        <Link
          className={s.navbarLogo}
          to="/"
          onClick={closeMenus}
          aria-label={t("brand")}
        >
          <span className={s.logoMark} aria-hidden="true">
            ✦
          </span>

          <span className={s.logoText}>{t("brand")}</span>
        </Link>

        {/* ===============================================
            NAVIGATION
        =============================================== */}

        <nav
          className={`${s.navbarRight} ${open ? s.showMenu : ""}`}
          aria-label={t("nav.main_navigation")}
        >
          <div className={s.mainLinks}>
            {/* HOME */}

            <Link
              to="/"
              className={isActive("/") ? s.activeLink : ""}
              onClick={closeMenus}
            >
              {t("nav.home")}
            </Link>

            {/* ABOUT */}

            <Link
              to="/about"
              className={isActive("/about") ? s.activeLink : ""}
              onClick={closeMenus}
            >
              {t("nav.about")}
            </Link>

            {/* MENU */}

            <Link
              to="/menu"
              className={isActive("/menu") ? s.activeLink : ""}
              onClick={closeMenus}
            >
              {t("nav.menu")}
            </Link>

            {/* CHEFS */}

            <Link
              to="/chefs"
              className={isActive("/chefs") ? s.activeLink : ""}
              onClick={closeMenus}
            >
              {t("nav.chefs")}
            </Link>

            {/* CART - STAFF ONLY */}

            {isStaff && (
              <Link
                to="/cart"
                className={isActive("/cart") ? s.activeLink : ""}
                onClick={closeMenus}
              >
                {t("nav.my_cart")}
              </Link>
            )}

            {/* KITCHEN */}

            {isKitchen && (
              <Link to="/kitchen" onClick={closeMenus} className={s.adminLink}>
                {t("nav.kitchen_panel")}
              </Link>
            )}

            {/* ADMIN */}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={closeMenus}
                className={s.adminLink}
              >
                {t("nav.admin_panel")}
              </Link>
            )}
          </div>

          {/* =============================================
              RIGHT ACTIONS
          ============================================= */}

          <div className={s.navActions}>
            {/* AUTH */}

            <div className={s.authArea}>
              {user ? (
                <>
                  <span className={s.userName}>{user.name || user.email}</span>

                  <button
                    type="button"
                    className={s.logoutIconBtn}
                    onClick={handleLogout}
                    aria-label={t("auth.logout")}
                    title={t("auth.logout")}
                    disabled={loggingOut}
                  >
                    <LogOut size={17} strokeWidth={1.8} />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={s.authLinkAccent}
                  onClick={closeMenus}
                >
                  {t("staff.login_btn")}
                </Link>
              )}
            </div>

            {/* =============================================
                LANGUAGE
            ============================================= */}

            <div className={s.langMenuWrap} ref={langRef}>
              <button
                type="button"
                className={s.langToggle}
                onClick={() => setLangOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={langOpen}
                aria-label={t("nav.select_language")}
                title={t("nav.language")}
                disabled={loggingOut}
              >
                <Globe2 className={s.globe} size={16} strokeWidth={1.6} />

                <span className={s.langCode}>{current}</span>

                <span
                  className={`${s.langArrow} ${
                    langOpen ? s.langArrowOpen : ""
                  }`}
                  aria-hidden="true"
                >
                  ↓
                </span>
              </button>

              <ul
                className={`${s.langMenu} ${langOpen ? s.showLangMenu : ""}`}
                role="menu"
              >
                {/* TURKISH */}

                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className={s.langItem}
                    onClick={() => changeLang("tr")}
                    disabled={loggingOut}
                  >
                    <span>TR</span>
                    <span>{t("nav.lang_tr")}</span>
                  </button>
                </li>

                {/* ENGLISH */}

                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className={s.langItem}
                    onClick={() => changeLang("en")}
                    disabled={loggingOut}
                  >
                    <span>EN</span>
                    <span>{t("nav.lang_en")}</span>
                  </button>
                </li>

                {/* FRENCH */}

                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className={s.langItem}
                    onClick={() => changeLang("fr")}
                    disabled={loggingOut}
                  >
                    <span>FR</span>
                    <span>{t("nav.lang_fr")}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* ===============================================
            MOBILE MENU BUTTON
        =============================================== */}

        <button
          type="button"
          className={s.burger}
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? t("nav.close_menu") : t("nav.open_menu")}
          aria-expanded={open}
          disabled={loggingOut}
        >
          {open ? (
            <X size={22} strokeWidth={1.7} />
          ) : (
            <Menu size={23} strokeWidth={1.7} />
          )}
        </button>
      </header>
    </>
  );
};

export default Navbar;
