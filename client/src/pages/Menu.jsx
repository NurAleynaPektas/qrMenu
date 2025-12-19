import React, { useEffect, useMemo, useState } from "react";
import s from "./Menu.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import iziToast from "izitoast";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMenu } from "../redux/menuSlice";
import { resolveImageUrl } from "../utils/resolveImageUrl";

export default function Menu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const {
    items: menuItems,
    loading,
    error,
  } = useSelector((state) => state.menu);

  // Aktif kategori filtresi
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  // Sadece aktif ürünler
  const visibleItems = useMemo(
    () => menuItems.filter((item) => item.available),
    [menuItems]
  );

  // 🔹 Kategori sırası (kod bazlı)
  const CATEGORY_ORDER = [
    "MAIN",
    "APPETIZER",
    "DESSERT",
    "DRINK",
    "SALAD",
    "SOUP",
  ];

  // 🔹 Kategori kodunu dile göre label yap
  const categoryLabel = (cat) => {
    switch (cat) {
      case "MAIN":
        return t("admin.cat_main") || "Ana Yemek";
      case "DRINK":
        return t("admin.cat_drink") || "İçecek";
      case "APPETIZER":
        return t("admin.cat_appetizer") || "Aperatif";
      case "DESSERT":
        return t("admin.cat_dessert") || "Tatlı";
      case "SOUPE":
        return t("admin.cat_soupes") || "Çorba";
      case "SALAD":
        return t("admin.cat_salads") || "Salata";
      default:
        return cat;
    }
  };

  // 🔹 Menüde gerçekten kullanılan kategoriler
  const categories = useMemo(() => {
    const set = new Set(
      visibleItems.map((it) => it.category).filter((c) => !!c)
    );
    const arr = Array.from(set);

    return arr.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);

      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [visibleItems]);

  // 🔹 Aktif kategoriye göre ürünler
  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return visibleItems;
    return visibleItems.filter((it) => it.category === activeCategory);
  }, [visibleItems, activeCategory]);

  const handleAddToCart = (item) => {
    if (!user) {
      iziToast.show({
        title: t("auth.login") || "Login",
        message:
          t("auth.login_to_add") || "Please login to add items to your cart.",
        backgroundColor: "#b91c1c",
        titleColor: "#ffffff",
        messageColor: "#fef2f2",
        position: "topCenter",
        timeout: 3500,
        progressBar: true,
      });

      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    const label = item.nameKey ? t(item.nameKey) : item.name;

    dispatch(
      addToCart({
        id: item.id,
        title: label,
        price: item.price,
        img: item.img,
        nameKey: item.nameKey || null,
      })
    );

    iziToast.show({
      title: t("home.added_title") || "Success",
      message: `${label} ${t("home.added_msg")}` || `${label} added to cart.`,
      backgroundColor: "#031f56",
      titleColor: "#ffffffff",
      messageColor: "#faf4f4ff",
      position: "topCenter",
      timeout: 2000,
      progressBar: true,
    });
  };

  return (
    <main className={s.menuPage}>
      <h1 className={s.title}>{t("home.title")}</h1>
      <p className={s.subtitle}>{t("home.about_p2")}</p>

      {/* Kategori filtre butonları */}
      {categories.length > 0 && (
        <div className={s.filters}>
          <h4 className={s.filtersTitle}>
            {t("admin.cat.filters") || "Filters"}
          </h4>
          <button
            type="button"
            className={`${s.filterBtn} ${
              activeCategory === "all" ? s.filterBtnActive : ""
            }`}
            onClick={() => setActiveCategory("all")}
          >
            {t("admin.filter_all") || "All"}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${s.filterBtn} ${
                activeCategory === cat ? s.filterBtnActive : ""
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      )}

      {/* YÜKLENİYOR DURUMU */}
      {loading && <p className={s.infoText}>Loading menu...</p>}

      {/* HATA DURUMU */}
      {error && !loading && (
        <p className={s.errorText}>
          {error || "Failed to load menu. Please try again."}
        </p>
      )}

      {/* MENÜ KARTLARI */}
      <section className={s.grid}>
        {!loading &&
          !error &&
          filteredItems.map((it) => {
            const label = it.nameKey ? t(it.nameKey) : it.name;

            return (
              <article className={s.card} key={it.id}>
                <img
                  src={resolveImageUrl(it.img, it.id)}
                  alt={label}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/400/250?random=${it.id}`;
                  }}
                />

                <div className={s.info}>
                  <h3 className={s.cardTitle}>{label}</h3>
                  <p className={s.cardPrice}>₺{it.price}</p>
                  <button
                    className={s.cardBtn}
                    onClick={() => handleAddToCart(it)}
                  >
                    {t("home.add")}
                  </button>
                </div>
              </article>
            );
          })}
      </section>
    </main>
  );
}
