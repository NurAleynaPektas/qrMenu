import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

import s from "./Cart.module.css";
import { increaseQty, decreaseQty, removeFromCart } from "../redux/cartSlice";

export default function Cart() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) return;

    navigate("/checkout");
  };

  return (
    <main className={s.cartPage}>
      <div className={s.container}>
        {/* =============================================
            HEADER
        ============================================= */}

        <header className={s.header}>
          <div className={s.headerTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>Your Order</span>
            </div>

            <span className={s.headerNumber}>01</span>
          </div>

          <div className={s.headerContent}>
            <div>
              <p className={s.kicker}>Selected · Fresh · Ready</p>

              <h1 className={s.cartTitle}>{t("cart.title")}</h1>
            </div>

            {cartItems.length > 0 && (
              <div className={s.orderCount}>
                <span className={s.orderCountNumber}>
                  {String(totalQuantity).padStart(2, "0")}
                </span>

                <span className={s.orderCountLabel}>Items in your order</span>
              </div>
            )}
          </div>
        </header>

        {/* =============================================
            EMPTY CART
        ============================================= */}

        {cartItems.length === 0 && (
          <section className={s.emptyWrap}>
            <div className={s.emptyMark} aria-hidden="true">
              ✦
            </div>

            <span className={s.emptyLabel}>Your selection</span>

            <h2 className={s.emptyTitle}>Your cart is empty.</h2>

            <p className={s.emptyText}>{t("cart.empty")}</p>

            <Link to="/menu" className={s.backToMenuBtn}>
              <span>{t("home.hero_cta")}</span>

              <ArrowRight size={17} strokeWidth={1.6} />
            </Link>
          </section>
        )}

        {/* =============================================
            CART CONTENT
        ============================================= */}

        {cartItems.length > 0 && (
          <div className={s.cartLayout}>
            {/* =========================================
                ITEMS
            ========================================= */}

            <section className={s.cartItems} aria-label="Cart items">
              <div className={s.listHeader}>
                <span>Selection</span>

                <span>
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </span>
              </div>

              {cartItems.map((item, index) => {
                const label =
                  (item.nameKey ? t(item.nameKey) : null) ||
                  item.title ||
                  item.name ||
                  "";

                const itemTotal = item.price * item.quantity;

                return (
                  <article className={s.cartItem} key={item.id}>
                    <div className={s.imageWrap}>
                      <img
                        className={s.cartItemImg}
                        src={item.img}
                        alt={label}
                      />

                      <span className={s.itemNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className={s.cartItemInfo}>
                      <div className={s.itemTop}>
                        <div>
                          <span className={s.itemCategory}>Menu selection</span>

                          <h2 className={s.cartItemName}>{label}</h2>
                        </div>

                        <button
                          type="button"
                          className={s.iconRemove}
                          onClick={() => dispatch(removeFromCart(item.id))}
                          aria-label={`Remove ${label}`}
                          title="Remove"
                        >
                          <Trash2 size={16} strokeWidth={1.6} />
                        </button>
                      </div>

                      <div className={s.itemBottom}>
                        <div
                          className={s.stepper}
                          role="group"
                          aria-label={`Quantity for ${label}`}
                        >
                          <button
                            type="button"
                            className={s.stepBtn}
                            onClick={() => dispatch(decreaseQty(item.id))}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} strokeWidth={1.7} />
                          </button>

                          <span className={s.stepValue}>{item.quantity}</span>

                          <button
                            type="button"
                            className={s.stepBtn}
                            onClick={() => dispatch(increaseQty(item.id))}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} strokeWidth={1.7} />
                          </button>
                        </div>

                        <div className={s.priceArea}>
                          {item.quantity > 1 && (
                            <span className={s.unitPrice}>
                              ₺{item.price} × {item.quantity}
                            </span>
                          )}

                          <span className={s.cartItemPrice}>₺{itemTotal}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              <Link to="/menu" className={s.continueShopping}>
                <span aria-hidden="true">←</span>
                <span>Continue exploring menu</span>
              </Link>
            </section>

            {/* =========================================
                SUMMARY
            ========================================= */}

            <aside className={s.cartSummary}>
              <div className={s.summaryTop}>
                <span className={s.summaryEyebrow}>Order summary</span>

                <span className={s.summaryMark}>✦</span>
              </div>

              <div className={s.summaryContent}>
                <div className={s.summaryRow}>
                  <span>Items</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className={s.summaryRow}>
                  <span>Subtotal</span>
                  <span>₺{total}</span>
                </div>
              </div>

              <div className={s.totalArea}>
                <span className={s.totalLabel}>{t("cart.total")}</span>

                <p className={s.cartTotal}>₺{total}</p>
              </div>

              <button
                type="button"
                className={s.checkoutBtn}
                onClick={handleCheckoutClick}
              >
                <span>{t("cart.checkout")}</span>

                <ArrowRight size={18} strokeWidth={1.6} />
              </button>

              <p className={s.summaryNote}>
                Your order will be confirmed before being sent to the kitchen.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
