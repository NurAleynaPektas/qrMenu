import { useTranslation } from "react-i18next";
import s from "./Home.module.css";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className={s.homePage}>
      <h1 className={s.homeTitle}>{t("home.title")}</h1>

      <div className={s.homeCategories}>
        <button className={`${s.homeCatBtn} ${s.homeCatBtnActive}`}>
          {t("home.meals")}
        </button>
        <button className={s.homeCatBtn}>{t("home.drinks")}</button>
        <button className={s.homeCatBtn}>{t("home.desserts")}</button>
      </div>

      <div className={s.homeGrid}>
        <article className={s.homeCard}>
          <img
            className={s.homeCardImg}
            src="https://via.placeholder.com/300x200"
            alt={t("home.items.meatball")}
          />
          <h3 className={s.homeCardTitle}>{t("home.items.meatball")}</h3>
          <p className={s.homeCardPrice}>₺120</p>
          <button className={s.homeAddBtn}>{t("home.add")}</button>
        </article>

        <article className={s.homeCard}>
          <img
            className={s.homeCardImg}
            src="https://via.placeholder.com/300x200"
            alt={t("home.items.ayran")}
          />
          <h3 className={s.homeCardTitle}>{t("home.items.ayran")}</h3>
          <p className={s.homeCardPrice}>₺25</p>
          <button className={s.homeAddBtn}>{t("home.add")}</button>
        </article>

        <article className={s.homeCard}>
          <img
            className={s.homeCardImg}
            src="https://via.placeholder.com/300x200"
            alt={t("home.items.souffle")}
          />
          <h3 className={s.homeCardTitle}>{t("home.items.souffle")}</h3>
          <p className={s.homeCardPrice}>₺60</p>
          <button className={s.homeAddBtn}>{t("home.add")}</button>
        </article>
      </div>
    </main>
  );
}
