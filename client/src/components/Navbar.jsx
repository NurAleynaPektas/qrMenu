import React, { useEffect, useRef, useState } from "react";
import s from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [open, setOpen] = useState(false); // hamburger
  const [langOpen, setLangOpen] = useState(false); // language dropdown
  const { t, i18n } = useTranslation();
  const langRef = useRef(null);

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
    setLangOpen(false);
    setOpen(false);
  };

  // Dışarı tıklayınca dil menüsünü kapat
  useEffect(() => {
    const onClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Butonda aktif dili kısa göster (TR/EN/FR)
  const current = (i18n.language || "en").toUpperCase().slice(0, 2);

  return (
    <header className={s.navbar}>
      <Link className={s.navbarLogo} to="/" onClick={() => setOpen(false)}>
        {t("brand")}
      </Link>

      <nav className={`${s.navbarRight} ${open ? s.showMenu : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          {t("nav.menu")}
        </Link>
        <Link to="/cart" onClick={() => setOpen(false)}>
          {t("nav.my_cart")}
        </Link>

        {/* Language dropdown */}
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
                Türkçe (TR)
              </button>
            </li>
            <li role="menuitem">
              <button className={s.langItem} onClick={() => changeLang("en")}>
                English (EN)
              </button>
            </li>
            <li role="menuitem">
              <button className={s.langItem} onClick={() => changeLang("fr")}>
                Français (FR)
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
