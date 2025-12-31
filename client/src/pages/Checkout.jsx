import { useTranslation } from "react-i18next";
import s from "./Checkout.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import iziToast from "izitoast";
import { clearCart } from "../redux/cartSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staffUser = useSelector((state) => state.auth.user);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
      .typeError(
        t("checkout.table_number_error") || "Please enter a valid table number."
      )
      .integer(
        t("checkout.table_number_integer") || "Table number must be an integer."
      )
      .min(
        1,
        t("checkout.table_number_min") || "Table number must be at least 1."
      )
      .required(
        t("checkout.table_number_required") || "Table number is required."
      ),
    note: Yup.string()
      .max(200, t("checkout.note_max") || "Note can be at most 200 characters.")
      .nullable(),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: values.tableNumber,
          note: values.note,
          items: itemsPayload,
          staffName: staffUser?.name || staffUser?.email || "Staff",
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
            ? "Bu masa zaten aktif. Yeni adisyon açılamaz."
            : "Failed to send order");
        throw new Error(msg);
      }

      dispatch(clearCart());

      iziToast.success({
        title: t("checkout.success_title") || "Success",
        message: t("checkout.success_msg") || "Order placed successfully.",
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
        title: "Error",
        message:
          err?.message ||
          t("auth.error") ||
          "Something went wrong. Please try again.",
        position: "topCenter",
        timeout: 3500,
      });
    }
  };

  return (
    <main className={s.checkoutPage}>
      <h1 className={s.checkoutTitle}>{t("checkout.title")}</h1>

      <Formik
        initialValues={{ tableNumber: "", note: "" }}
        validationSchema={CheckoutSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <section className={s.checkoutForm}>
              <div className={s.formRow}>
                <label htmlFor="tableNumber" className={s.formLabel}>
                  {t("checkout.table_number")}
                </label>

                <Field
                  as="select"
                  id="tableNumber"
                  name="tableNumber"
                  className={s.formInput}
                >
                  <option value="">
                    {t("checkout.table_number_placeholder") || "Masa seçin"}
                  </option>

                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {t("checkout.table_label")
                        ? t("checkout.table_label", { n })
                        : `Masa ${n}`}
                    </option>
                  ))}
                </Field>

                <ErrorMessage
                  name="tableNumber"
                  component="p"
                  className={s.error}
                />
              </div>

              <div className={s.formRow}>
                <label htmlFor="note" className={s.formLabel}>
                  {t("checkout.note_optional")}
                </label>
                <Field
                  id="note"
                  name="note"
                  as="textarea"
                  rows={3}
                  className={s.formTextarea}
                  placeholder={t("checkout.note_placeholder")}
                />
                <ErrorMessage name="note" component="p" className={s.error} />
              </div>
            </section>

            <section className={s.checkoutSummary}>
              <h2 className={s.summaryTitle}>{t("checkout.order_summary")}</h2>

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
                      const label =
                        (item.nameKey ? t(item.nameKey) : null) ||
                        item.title ||
                        item.name ||
                        "";

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

                  <button
                    type="submit"
                    className={s.placeOrderBtn}
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    {t("checkout.place_order")}
                  </button>
                </>
              )}
            </section>
          </Form>
        )}
      </Formik>
    </main>
  );
}
