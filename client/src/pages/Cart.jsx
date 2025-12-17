import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import s from "./Cart.module.css";
import { increaseQty, decreaseQty, removeFromCart } from "../redux/cartSlice";

export default function Cart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

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

        {cartItems.map((item) => {
          const label =
            (item.nameKey ? t(item.nameKey) : null) ||
            item.title ||
            item.name ||
            "";

          return (
            <article className={s.cartItem} key={item.id}>
              <img className={s.cartItemImg} src={item.img} alt={label} />

              <div className={s.cartItemInfo}>
                <h3 className={s.cartItemName}>{label}</h3>
                <p className={s.cartItemPrice}>₺{item.price}</p>
              </div>

              <div className={s.cartItemControls}>
                {/* ✅ Stepper: tek parça modern qty */}
                <div className={s.stepper} role="group" aria-label="Quantity">
                  <button
                    type="button"
                    className={s.stepBtn}
                    onClick={() => dispatch(decreaseQty(item.id))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span className={s.stepValue}>{item.quantity}</span>

                  <button
                    type="button"
                    className={s.stepBtn}
                    onClick={() => dispatch(increaseQty(item.id))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* ✅ Remove: trash icon buton */}
                <button
                  type="button"
                  className={s.iconRemove}
                  onClick={() => dispatch(removeFromCart(item.id))}
                  aria-label="Remove item"
                  title="Remove"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v9h-2v-9Zm4 0h2v9h-2v-9ZM7 10h2v9H7v-9Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {cartItems.length > 0 && (
        <div className={s.cartSummary}>
          <p className={s.cartTotal}>
            {t("cart.total")}: <span>₺{total}</span>
          </p>
          <button
            type="button"
            className={s.checkoutBtn}
            onClick={handleCheckoutClick}
          >
            {t("cart.checkout")}
          </button>
        </div>
      )}
    </main>
  );
}
