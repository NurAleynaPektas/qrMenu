import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import iziToast from "izitoast";

import s from "./Menu.module.css";
import { addToCart } from "../redux/cartSlice";
import { fetchMenu } from "../redux/menuSlice";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import Loader from "../components/Loader";

export default function Menu() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, role } = useSelector((state) => state.auth);

  const {
    items: menuItems,
    loading,
    error,
  } = useSelector((state) => state.menu);

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const visibleItems = useMemo(
    () => (menuItems || []).filter((item) => item.available),
    [menuItems],
  );

  const CATEGORY_ORDER = [
    "MAIN",
    "APPETIZER",
    "DESSERT",
    "DRINK",
    "SALAD",
    "SOUPE",
  ];

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

  const categories = useMemo(() => {
    const set = new Set(
      visibleItems.map((item) => item.category).filter(Boolean),
    );

    const arr = Array.from(set);

    return arr.sort((a, b) => {
      const indexA = CATEGORY_ORDER.indexOf(a);
      const indexB = CATEGORY_ORDER.indexOf(b);

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [visibleItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") {
      return visibleItems;
    }

    return visibleItems.filter((item) => item.category === activeCategory);
  }, [visibleItems, activeCategory]);

  const handleAddToCart = (item) => {
    if (!user || role !== "staff") {
      iziToast.show({
        title: t("staff.login_title") || "Personel Girişi",
        message:
          t("staff.login_to_order") ||
          "Sipariş oluşturmak için personel girişi yapın.",
        backgroundColor: "#641c23",
        titleColor: "#ffffff",
        messageColor: "#fef2f2",
        position: "topCenter",
        timeout: 3000,
        progressBar: true,
      });

      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });

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
      }),
    );

    iziToast.show({
      title: t("home.added_title") || "Success",
      message: `${label} ${t("home.added_msg")}` || `${label} added to cart.`,
      backgroundColor: "#641c23",
      titleColor: "#ffffff",
      messageColor: "#fff8f5",
      position: "topCenter",
      timeout: 2000,
      progressBar: true,
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className={s.menuPage}>
      <div className={s.menuContainer}>
        {/* =================================================
            HEADER
        ================================================= */}
        <header className={s.menuHeader}>
          <div className={s.headerTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>Our Menu</span>
            </div>

            <span className={s.headerNumber}>01</span>
          </div>

          <div className={s.headerContent}>
            <h1 className={s.title}>{t("home.title")}</h1>

            <div className={s.headerSide}>
              <p className={s.subtitle}>{t("home.about_p2")}</p>

              <span className={s.season}>Seasonal · Fresh · Crafted</span>
            </div>
          </div>
        </header>

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div className={s.errorBox}>
            <span className={s.errorLabel}>Error</span>

            <p className={s.errorText}>
              {error || "Failed to load menu. Please try again."}
            </p>
          </div>
        )}

        {/* =================================================
            FILTERS
        ================================================= */}
        {!error && categories.length > 0 && (
          <div className={s.filtersWrap}>
            <div className={s.filtersLabel}>Categories</div>

            <div className={s.filters}>
              <button
                type="button"
                className={`${s.filterBtn} ${
                  activeCategory === "all" ? s.filterBtnActive : ""
                }`}
                onClick={() => setActiveCategory("all")}
              >
                <span>{t("admin.filter_all") || "Tümü"}</span>
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
                  <span>{categoryLabel(cat)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =================================================
            MENU GRID
        ================================================= */}
        {!error && (
          <section className={s.grid} aria-label="Menu items">
            {filteredItems.map((item, index) => {
              const label = item.nameKey ? t(item.nameKey) : item.name;

              const isPopular =
                Boolean(item.isPopular) || Number(item.price) >= 250;

              const desc = item.descriptionKey
                ? t(item.descriptionKey)
                : item.description || item.desc || "";

              return (
                <article className={s.card} key={item.id}>
                  {/* IMAGE */}
                  <div className={s.media}>
                    <img
                      className={s.cardImg}
                      src={resolveImageUrl(item.img, item.id)}
                      alt={label}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = `https://picsum.photos/600/400?random=${item.id}`;
                      }}
                    />

                    <span className={s.cardIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {isPopular && (
                      <span className={s.badge}>
                        <span>★</span>

                        {t("home.popular") || "Popüler"}
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className={s.content}>
                    <div className={s.cardHeading}>
                      <h2 className={s.cardTitle}>{label}</h2>

                      <p className={s.cardPrice}>₺{item.price}</p>
                    </div>

                    {desc && <p className={s.cardDesc}>{desc}</p>}

                    <div className={s.cardFooter}>
                      <span className={s.category}>
                        {categoryLabel(item.category)}
                      </span>

                      <button
                        type="button"
                        className={s.addBtn}
                        onClick={() => handleAddToCart(item)}
                        aria-label={`${t("home.add") || "Sepete Ekle"}: ${label}`}
                      >
                        <Plus className={s.plus} size={16} strokeWidth={1.7} />

                        <span className={s.addText}>
                          {t("home.add") || "Sepete Ekle"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {!error && filteredItems.length === 0 && (
          <div className={s.emptyState}>
            <span>Menu</span>

            <p>No dishes are currently available in this category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
