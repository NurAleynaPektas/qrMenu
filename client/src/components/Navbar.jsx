import React, { useState } from "react";
import s from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setOpen(false);
  };

  return (
    <header className={s.navbar}>
      <Link className={s.navbarLogo} to="/" onClick={() => setOpen(false)}>
        {t("brand")}
      </Link>

      <nav className={`${s.navbarRight} ${open ? s.showMenu : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          {t("menu")}
        </Link>
        <Link to="/cart" onClick={() => setOpen(false)}>
          {t("my_cart")}
        </Link>

        {/* Language switcher (mobilde menünün içinde, desktop'ta sağda) */}
        <div className={s.langSwitch}>
          <button
            className={`${s.langBtn} ${
              i18n.language === "tr" ? s.langActive : ""
            }`}
            onClick={() => changeLang("tr")}
            aria-label="Türkçe"
          >
            TR
          </button>

          <button
            className={`${s.langBtn} ${
              i18n.language === "en" ? s.langActive : ""
            }`}
            onClick={() => changeLang("en")}
            aria-label="English"
          >
            EN
          </button>

          <button
            className={`${s.langBtn} ${
              i18n.language === "fr" ? s.langActive : ""
            }`}
            onClick={() => changeLang("fr")}
            aria-label="Français"
          >
            FR
          </button>
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
