import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Select from "@radix-ui/react-select";
import s from "./Home.module.css";

export default function Home() {
  const { t } = useTranslation();
  const [active, setActive] = useState("meals"); // meals | drinks | desserts

  return (
    <main className={s.homePage}>
      <h1 className={s.homeTitle}>{t("home.title")}</h1>

      {/* --- MOBİL: Radix Select --- */}
      <div className={s.catSelectRadix}>
        <Select.Root value={active} onValueChange={setActive}>
          <Select.Trigger className={s.selTrigger} aria-label="Category">
            <Select.Value placeholder={t(`home.${active}`)} />
            <Select.Icon className={s.selIcon}>▾</Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className={s.selContent}
              position="popper"
              sideOffset={6}
            >
              <Select.Viewport className={s.selViewport}>
                <Select.Item className={s.selItem} value="meals">
                  <Select.ItemText>{t("home.meals")}</Select.ItemText>
                </Select.Item>
                <Select.Item className={s.selItem} value="drinks">
                  <Select.ItemText>{t("home.drinks")}</Select.ItemText>
                </Select.Item>
                <Select.Item className={s.selItem} value="desserts">
                  <Select.ItemText>{t("home.desserts")}</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* --- TABLET/DESKTOP: Buton bar --- */}
      <div className={s.homeCategories}>
        <button
          className={`${s.homeCatBtn} ${
            active === "meals" ? s.homeCatBtnActive : ""
          }`}
          onClick={() => setActive("meals")}
        >
          {t("home.meals")}
        </button>
        <button
          className={`${s.homeCatBtn} ${
            active === "drinks" ? s.homeCatBtnActive : ""
          }`}
          onClick={() => setActive("drinks")}
        >
          {t("home.drinks")}
        </button>
        <button
          className={`${s.homeCatBtn} ${
            active === "desserts" ? s.homeCatBtnActive : ""
          }`}
          onClick={() => setActive("desserts")}
        >
          {t("home.desserts")}
        </button>
      </div>

      {/* --- Ürün grid (örnek) --- */}
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
