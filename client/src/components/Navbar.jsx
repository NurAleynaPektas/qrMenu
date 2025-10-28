import React, { useState } from "react";
import s from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={s.navbar}>
      <Link className={s.navbarLogo} to="/">
        Friend's First
      </Link>
      <nav className={`${s.navbarRight} ${open ? s.showMenu : ""}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          Menu
        </Link>
        <Link to="/cart" onClick={() => setOpen(false)}>
          MyCart
        </Link>
      </nav>
      <button
        className={s.burger}
        onClick={() => setOpen(!open)}
        aria-label="menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
};

export default Navbar;
