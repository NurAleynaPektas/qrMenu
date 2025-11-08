import React from "react";
import s from "./Menu.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import iziToast from "izitoast";

export default function Menu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const items = [
    {
      id: 1,
      nameKey: "home.items.meatball",
      price: 180,
      img: "https://picsum.photos/400/250?food1",
    },
    {
      id: 2,
      nameKey: "home.items.ayran",
      price: 90,
      img: "https://picsum.photos/400/250?food2",
    },
    {
      id: 3,
      nameKey: "home.items.souffle",
      price: 60,
      img: "https://picsum.photos/400/250?food3",
    },
    {
      id: 4,
      nameKey: "home.items.lemonade",
      price: 35,
      img: "https://picsum.photos/400/250?drink",
    },
  ];

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));

    iziToast.show({
      title: t("home.added_title") || "Success",
      message:
        `${t(item.nameKey)} ${t("home.added_msg")}` ||
        `${t(item.nameKey)} added to cart.`,
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
        {items.map((it) => (
          <article className={s.card} key={it.id}>
            <img src={it.img} alt={t(it.nameKey)} loading="lazy" />
            <div className={s.info}>
              <h3 className={s.cardTitle}>{t(it.nameKey)}</h3>
              <p className={s.cardPrice}>₺{it.price}</p>
              <button className={s.cardBtn} onClick={() => handleAddToCart(it)}>
                {t("home.add")}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
