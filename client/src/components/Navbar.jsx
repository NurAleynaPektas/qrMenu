import React from "react";
import s from "./Navbar.module.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className={s.navbar}>
      <div className={s.navbarLeft}>
        <h2>QrMenu</h2>
      </div>
      <div className={s.navbarRight}>
        <Link to="/">Menü</Link>
        <Link to="/cart">Sepetim</Link>
      </div>
    </div>
  );
};

export default Navbar;
