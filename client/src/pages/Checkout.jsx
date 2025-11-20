import { useTranslation } from "react-i18next";
import s from "./Checkout.module.css";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Checkout() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  // Kullanıcı yoksa login'e at
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
    }
  }, [user, navigate]);

  if (!user) return null;

  // Sepet boşsa basit bir guard (istersen kaldırabiliriz)
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className={s.checkoutPage}>
      <h1 className={s.checkoutTitle}>{t("checkout.title")}</h1>

      <section className={s.checkoutForm}>
        <div className={s.formRow}>
          <label htmlFor="table" className={s.formLabel}>
            {t("checkout.table_number")}
          </label>
          <input
            id="table"
            className={s.formInput}
            placeholder="e.g. 5"
            // burada state tutup masayı da ileride order objesine ekleyebiliriz
          />
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

        {/* Sepet boşsa mesaj göster */}
        {cartItems.length === 0 ? (
          <div className={s.emptySummary}>
            <p>{t("cart.empty")}</p>
            <Link to="/menu" className={s.backToMenuBtn}>
              {t("home.hero_cta")}
            </Link>
          </div>
        ) : (
          <>
            <div className={s.summaryItems}>
              {cartItems.map((item) => {
                const label = item.nameKey ? t(item.nameKey) : item.title || "";

                return (
                  <div className={s.summaryItem} key={item.id}>
                    <span>
                      {label} x{item.quantity}
                    </span>
                    <span>₺{item.price * item.quantity}</span>
                  </div>
                );
              })}
            </div>

            <div className={s.summaryTotal}>
              <span>{t("checkout.total")}</span>
              <span className={s.totalPrice}>₺{total}</span>
            </div>

            <button className={s.placeOrderBtn}>
              {t("checkout.place_order")}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
