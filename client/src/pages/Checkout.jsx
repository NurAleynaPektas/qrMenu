import { useTranslation } from "react-i18next";
import s from "./Checkout.module.css";

export default function Checkout() {
  const { t } = useTranslation();

  return (
    <main className={s.checkoutPage}>
      <h1 className={s.checkoutTitle}>{t("checkout.title")}</h1>

      <section className={s.checkoutForm}>
        <div className={s.formRow}>
          <label htmlFor="table" className={s.formLabel}>
            {t("checkout.table_number")}
          </label>
          <input id="table" className={s.formInput} placeholder="e.g. 5" />
        </div>

        <div className={s.formRow}>
          <label htmlFor="note" className={s.formLabel}>
            {t("checkout.note_optional")}
          </label>
          <textarea
            id="note"
            className={s.formTextarea}
            rows={3}
            placeholder={t("checkout.note_placeholder")}
          />
        </div>
      </section>

      <section className={s.checkoutSummary}>
        <h2 className={s.summaryTitle}>{t("checkout.order_summary")}</h2>

        <div className={s.summaryItems}>
          <div className={s.summaryItem}>
            <span>{t("checkout.sample.burger_x1")}</span>
            <span>₺150</span>
          </div>
          <div className={s.summaryItem}>
            <span>{t("checkout.sample.lemonade_x2")}</span>
            <span>₺70</span>
          </div>
        </div>

        <div className={s.summaryTotal}>
          <span>{t("checkout.total")}</span>
          <span className={s.totalPrice}>₺220</span>
        </div>

        <button className={s.placeOrderBtn}>{t("checkout.place_order")}</button>
      </section>
    </main>
  );
}
