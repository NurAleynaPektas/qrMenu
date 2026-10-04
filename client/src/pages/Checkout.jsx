import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import iziToast from "izitoast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import s from "./Checkout.module.css";
import { clearCart } from "../redux/cartSlice";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { t } = useTranslation();

  const cartItems = useSelector((state) => state.cart.items);
  const staffUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const CheckoutSchema = Yup.object().shape({
    tableNumber: Yup.number()
      .transform((value, originalValue) => {
        if (
          originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
        ) {
          return NaN;
        }

        return Number(originalValue);
      })
      .typeError(t("checkout.table_number_error"))
      .integer(t("checkout.table_number_integer"))
      .min(1, t("checkout.table_number_min"))
      .required(t("checkout.table_number_required")),

    note: Yup.string().max(200, t("checkout.note_max")).nullable(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (cartItems.length === 0) return;

    const itemsPayload = cartItems.map((item) => ({
      id: item.id,
      title: item.title || item.name || "",
      nameKey: item.nameKey || null,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          table: values.tableNumber,
          note: values.note,
          items: itemsPayload,
          staffName:
            staffUser?.name || staffUser?.email || t("checkout.staff_fallback"),
        }),
      });

      let data = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          data?.message ||
          (res.status === 409
            ? t("checkout.table_active_error")
            : t("checkout.send_error"));

        throw new Error(msg);
      }

      dispatch(clearCart());

      iziToast.success({
        title: t("checkout.success_title"),
        message: t("checkout.success_msg"),
        backgroundColor: "#025127ff",
        titleColor: "#ffffff",
        messageColor: "#e6fff4",
        position: "topCenter",
        timeout: 2500,
      });

      resetForm();

      setTimeout(() => {
        navigate("/menu");
      }, 2600);
    } catch (err) {
      console.error(err);

      iziToast.error({
        title: t("common.error_title"),
        message: err?.message || t("auth.error") || t("checkout.generic_error"),
        position: "topCenter",
        timeout: 3500,
      });
    }
  };

  return (
    <main className={s.checkoutPage}>
      <div className={s.container}>
        {/* =============================================
            HEADER
        ============================================= */}

        <header className={s.header}>
          <div className={s.headerTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>{t("checkout.eyebrow")}</span>
            </div>

            <span className={s.headerNumber}>02</span>
          </div>

          <div className={s.headerContent}>
            <div>
              <p className={s.kicker}>{t("checkout.kicker")}</p>

              <h1 className={s.checkoutTitle}>{t("checkout.title")}</h1>
            </div>

            {cartItems.length > 0 && (
              <div className={s.orderMeta}>
                <span className={s.orderMetaNumber}>
                  {String(totalQuantity).padStart(2, "0")}
                </span>

                <span className={s.orderMetaText}>
                  {t("checkout.items_ready")}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* =============================================
            CHECKOUT FORM
        ============================================= */}

        <Formik
          initialValues={{
            tableNumber: "",
            note: "",
          }}
          validationSchema={CheckoutSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className={s.checkoutLayout}>
              {/* =========================================
                  FORM
              ========================================= */}

              <section className={s.formSection}>
                <div className={s.sectionHeading}>
                  <span className={s.sectionNumber}>01</span>

                  <div>
                    <span className={s.sectionEyebrow}>
                      {t("checkout.order_details")}
                    </span>

                    <h2 className={s.sectionTitle}>
                      {t("checkout.serve_title")}
                    </h2>
                  </div>
                </div>

                <div className={s.checkoutForm}>
                  {/* TABLE */}

                  <div className={s.formRow}>
                    <label htmlFor="tableNumber" className={s.formLabel}>
                      <span>{t("checkout.table_number")}</span>

                      <span className={s.required}>
                        {t("checkout.required")}
                      </span>
                    </label>

                    <div className={s.selectWrap}>
                      <Field
                        as="select"
                        id="tableNumber"
                        name="tableNumber"
                        className={s.formInput}
                      >
                        <option value="">
                          {t("checkout.table_number_placeholder")}
                        </option>

                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {t("checkout.table_label", {
                                n,
                              })}
                            </option>
                          ),
                        )}
                      </Field>

                      <ChevronDown
                        className={s.selectIcon}
                        size={17}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>

                    <ErrorMessage
                      name="tableNumber"
                      component="p"
                      className={s.error}
                    />
                  </div>

                  {/* NOTE */}

                  <div className={s.formRow}>
                    <label htmlFor="note" className={s.formLabel}>
                      <span>{t("checkout.note_optional")}</span>

                      <span className={s.optional}>
                        {t("checkout.optional")}
                      </span>
                    </label>

                    <Field
                      id="note"
                      name="note"
                      as="textarea"
                      rows={5}
                      className={s.formTextarea}
                      placeholder={t("checkout.note_placeholder")}
                    />

                    <div className={s.noteMeta}>
                      <span>{t("checkout.special_requests")}</span>

                      <span>{values.note?.length || 0}/200</span>
                    </div>

                    <ErrorMessage
                      name="note"
                      component="p"
                      className={s.error}
                    />
                  </div>
                </div>

                <Link to="/cart" className={s.backToCart}>
                  <ArrowLeft size={15} strokeWidth={1.6} />

                  <span>{t("checkout.back_to_order")}</span>
                </Link>
              </section>

              {/* =========================================
                  SUMMARY
              ========================================= */}

              <aside className={s.checkoutSummary}>
                <div className={s.summaryHeader}>
                  <div>
                    <span className={s.summaryEyebrow}>
                      {t("checkout.your_selection")}
                    </span>

                    <h2 className={s.summaryTitle}>
                      {t("checkout.order_summary")}
                    </h2>
                  </div>

                  <span className={s.summaryMark} aria-hidden="true">
                    ✦
                  </span>
                </div>

                {cartItems.length === 0 ? (
                  <div className={s.emptySummary}>
                    <span className={s.emptyMark} aria-hidden="true">
                      ✦
                    </span>

                    <p>{t("cart.empty")}</p>

                    <Link to="/menu" className={s.backToMenuBtn}>
                      <span>{t("home.hero_cta")}</span>

                      <ArrowRight size={16} strokeWidth={1.6} />
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className={s.summaryItems}>
                      {cartItems.map((item, index) => {
                        const label =
                          (item.nameKey ? t(item.nameKey) : null) ||
                          item.title ||
                          item.name ||
                          "";

                        return (
                          <div className={s.summaryItem} key={item.id}>
                            <div className={s.summaryItemInfo}>
                              <span className={s.summaryItemNumber}>
                                {String(index + 1).padStart(2, "0")}
                              </span>

                              <div>
                                <span className={s.summaryItemName}>
                                  {label}
                                </span>

                                <span className={s.summaryQuantity}>
                                  {t("checkout.quantity")} {item.quantity}
                                </span>
                              </div>
                            </div>

                            <span className={s.summaryItemPrice}>
                              ₺{item.price * item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className={s.summaryTotal}>
                      <span className={s.totalLabel}>
                        {t("checkout.total")}
                      </span>

                      <span className={s.totalPrice}>₺{total}</span>
                    </div>

                    <button
                      type="submit"
                      className={s.placeOrderBtn}
                      disabled={isSubmitting || cartItems.length === 0}
                    >
                      <span>
                        {isSubmitting
                          ? t("checkout.sending")
                          : t("checkout.place_order")}
                      </span>

                      <ArrowRight size={18} strokeWidth={1.6} />
                    </button>

                    <p className={s.summaryNote}>
                      {t("checkout.summary_note")}
                    </p>
                  </>
                )}
              </aside>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
}
