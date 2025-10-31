import { useTranslation } from "react-i18next";
import s from "./Cart.module.css";

export default function Cart() {
  const { t } = useTranslation();

  return (
    <main className={s.cartPage}>
      <h1 className={s.cartTitle}>{t("cart.title")}</h1>

      <div className={s.cartItems}>
        <article className={s.cartItem}>
          <img
            className={s.cartItemImg}
            src="https://via.placeholder.com/100x100"
            alt={t("cart.sample.burger")}
          />
          <div className={s.cartItemInfo}>
            <h3 className={s.cartItemName}>{t("cart.sample.burger")}</h3>
            <p className={s.cartItemPrice}>₺150</p>
          </div>
          <div className={s.cartItemControls}>
            <button>{t("cart.qty_minus")}</button>
            <span>1</span>
            <button>{t("cart.qty_plus")}</button>
          </div>
        </article>

        <article className={s.cartItem}>
          <img
            className={s.cartItemImg}
            src="https://via.placeholder.com/100x100"
            alt={t("cart.sample.lemonade")}
          />
          <div className={s.cartItemInfo}>
            <h3 className={s.cartItemName}>{t("cart.sample.lemonade")}</h3>
            <p className={s.cartItemPrice}>₺35</p>
          </div>
          <div className={s.cartItemControls}>
            <button>{t("cart.qty_minus")}</button>
            <span>2</span>
            <button>{t("cart.qty_plus")}</button>
          </div>
        </article>
      </div>

      <div className={s.cartSummary}>
        <p className={s.cartTotal}>
          {t("cart.total")}: <span>₺220</span>
        </p>
        <button className={s.checkoutBtn}>{t("cart.checkout")}</button>
      </div>
    </main>
  );
}
