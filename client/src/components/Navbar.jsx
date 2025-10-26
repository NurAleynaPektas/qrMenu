import React from 'react'
import s from "./Navbar.module.css"
const Navbar = () => {
  return (
    
    <div className={s.navbar}>
      <div className={s.navbarLeft}>
        <h2>QrMenu</h2>
      </div>
          <div className={s.navbarRight}>
              <a href="/">Menu</a>
              <a href="cart">Cart</a>
      </div>
    </div>
  );
}

export default Navbar
