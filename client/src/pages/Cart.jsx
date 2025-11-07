import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import s from "./Cart.module.css";
import { increaseQty, decreaseQty, removeFromCart } from "../redux/cartSlice";

export default function Cart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className={s.cartPage}>
      <h1 className={s.cartTitle}>{t("cart.title")}</h1>

      <div className={s.cartItems}>
        {cartItems.length === 0 && (
          <div className={s.emptyWrap}>
            <p className={s.emptyText}>{t("cart.empty")}</p>
            <Link to="/menu" className={s.backToMenuBtn}>
              {t("home.hero_cta")}
            </Link>
          </div>
        )}

        {cartItems.map((item) => (
          <article className={s.cartItem} key={item.id}>
            <img
              className={s.cartItemImg}
              src={item.img}
              alt={t(item.nameKey)}
            />
            <div className={s.cartItemInfo}>
              {/* 🔥 YİNE i18n KULLANIYORUZ */}
              <h3 className={s.cartItemName}>{t(item.nameKey)}</h3>
              <p className={s.cartItemPrice}>₺{item.price}</p>
            </div>
            <div className={s.cartItemControls}>
              <button onClick={() => dispatch(decreaseQty(item.id))}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(increaseQty(item.id))}>+</button>
              <button onClick={() => dispatch(removeFromCart(item.id))}>
                ✕
              </button>
            </div>
          </article>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className={s.cartSummary}>
          <p className={s.cartTotal}>
            {t("cart.total")}: <span>₺{total}</span>
          </p>
          <button className={s.checkoutBtn}>{t("cart.checkout")}</button>
        </div>
      )}
    </main>
  );
}
