import React from "react";
import s from "./Menu.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export default function Menu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const items = [
    {
      id: 1,
      title: "Grilled Steak",
      price: 180,
      img: "https://picsum.photos/400/250?food1",
    },
    {
      id: 2,
      title: "Fresh Salad",
      price: 90,
      img: "https://picsum.photos/400/250?food2",
    },
    {
      id: 3,
      title: "Souffle",
      price: 60,
      img: "https://picsum.photos/400/250?food3",
    },
    {
      id: 4,
      title: "Lemonade",
      price: 35,
      img: "https://picsum.photos/400/250?drink",
    },
  ];

  return (
    <main className={s.menuPage}>
      <h1 className={s.title}>{t("home.title")}</h1>
      <p className={s.subtitle}>{t("home.about_p2")}</p>

      <section className={s.grid}>
        {items.map((it) => (
          <article className={s.card} key={it.id}>
            <img src={it.img} alt={it.title} loading="lazy" />
            <div className={s.info}>
              <h3 className={s.cardTitle}>{it.title}</h3>
              <p className={s.cardPrice}>₺{it.price}</p>
              <button
                className={s.cardBtn}
                onClick={() => dispatch(addToCart(it))}
              >
                {t("home.add")}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
