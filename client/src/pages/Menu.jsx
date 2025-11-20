import React from "react";
import s from "./Menu.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import iziToast from "izitoast";
import { useNavigate, useLocation } from "react-router-dom";

export default function Menu() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const menuItems = useSelector((state) => state.menu.items);

  const visibleItems = menuItems.filter((item) => item.available);

  const handleAddToCart = (item) => {
    if (!user) {
      iziToast.show({
        title: t("auth.login") || "Login",
        message:
          t("auth.login_to_add") || "Please login to add items to your cart.",
        backgroundColor: "#b91c1c",
        titleColor: "#ffffff",
        messageColor: "#fef2f2",
        position: "topCenter",
        timeout: 3500,
        progressBar: true,
      });

      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const label = item.nameKey ? t(item.nameKey) : item.name;

    dispatch(
      addToCart({
        id: item.id,
        title: label,
        price: item.price,
        img: item.img,
        nameKey: item.nameKey || null,
      })
    );

    iziToast.show({
      title: t("home.added_title") || "Success",
      message: `${label} ${t("home.added_msg")}` || `${label} added to cart.`,
      backgroundColor: "#031f56",
      titleColor: "#ffffffff",
      messageColor: "#faf4f4ff",
      position: "topCenter",
      timeout: 2000,
      progressBar: true,
    });
  };

  return (
    <main className={s.menuPage}>
      <h1 className={s.title}>{t("home.title")}</h1>
      <p className={s.subtitle}>{t("home.about_p2")}</p>

      <section className={s.grid}>
        {visibleItems.map((it) => {
          const label = it.nameKey ? t(it.nameKey) : it.name;

          return (
            <article className={s.card} key={it.id}>
              <img src={it.img} alt={label} loading="lazy" />
              <div className={s.info}>
                <h3 className={s.cardTitle}>{label}</h3>
                <p className={s.cardPrice}>₺{it.price}</p>
                <button
                  className={s.cardBtn}
                  onClick={() => handleAddToCart(it)}
                >
                  {t("home.add")}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
