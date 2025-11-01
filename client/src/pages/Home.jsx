import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Select from "@radix-ui/react-select";
import s from "./Home.module.css";

// Görseller
import heroImg from "../assets/hero.jpg";
import diningImg from "../assets/dining.webp";
import chef1 from "../assets/chef1.png";
import chef2 from "../assets/chef2.png";
import chef3 from "../assets/chef3.png";
import her from "../assets/her.png";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";

function useInterval(callback, delay, isRunning = true) {
  const savedCb = useRef(callback);
  useEffect(() => {
    savedCb.current = callback;
  }, [callback]);
  useEffect(() => {
    if (!isRunning || delay == null) return;
    const id = setInterval(() => savedCb.current(), delay);
    return () => clearInterval(id);
  }, [delay, isRunning]);
}

export default function Home() {
  const { t } = useTranslation();


  const [active, setActive] = useState("meals"); 

 
  const slides = [
    { src: heroImg, alt: "Restaurant ambience" },
    { src: diningImg, alt: "Dining table" },
    { src: hero1, alt: "Dining table" },
    { src: hero2, alt: "Dining table " },
    
  ];
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);


  useInterval(() => setIdx((i) => (i + 1) % slides.length), 4000, !paused);

  return (
    <main className={s.homePage}>
      {/* === HERO SLIDER === */}
      <section
        className={s.hero}
        aria-label="Hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Arka plan renk/ışık katmanı */}
        <div className={s.heroOverlay} />

        {/* Slaytlar */}
        <div className={s.heroSlides} role="list">
          {slides.map((sl, i) => (
            <div
              key={sl.src + i}
              role="listitem"
              className={`${s.heroSlide} ${i === idx ? s.isActive : ""}`}
            >
              <img className={s.heroBg} src={sl.src} alt={sl.alt} />
            </div>
          ))}
        </div>

        {/* Metin katmanı */}
        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>{t("home.hero_title")}</h1>
          <p className={s.heroSubtitle}>{t("home.hero_sub")}</p>
          <a className={s.heroBtn} href="#menu">
            {t("home.hero_cta")}
          </a>
        </div>

        {/* Nokta kontrolleri */}
        <div className={s.heroDots} aria-label="Slide controls">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${s.heroDot} ${i === idx ? s.heroDotActive : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx ? "true" : "false"}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className={s.about} aria-label="About us">
        <div className={s.aboutImageWrap}>
          <img className={s.aboutImg} src={diningImg} alt="Dining table" />
        </div>
        <div className={s.aboutText}>
          <h2 className={s.sectionTitle}>{t("home.about_title")}</h2>
          <p className={s.aboutP}>{t("home.about_p1")}</p>
          <p className={s.aboutP}>{t("home.about_p2")}</p>
        </div>
      </section>

      {/* ===== MENU / CATEGORIES ===== */}
      <section id="menu" className={s.menuSection} aria-label="Menu">
        <h2 className={s.sectionTitle}>{t("home.title")}</h2>

        {/* Mobile: Radix Select */}
        <div className={s.catSelectRadix}>
          <Select.Root value={active} onValueChange={setActive}>
            <Select.Trigger className={s.selTrigger} aria-label="Category">
              <Select.Value placeholder={t(`home.${active}`)} />
              <Select.Icon className={s.selIcon}>▾</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className={s.selContent}
                position="popper"
                sideOffset={6}
              >
                <Select.Viewport className={s.selViewport}>
                  <Select.Item className={s.selItem} value="meals">
                    <Select.ItemText>{t("home.meals")}</Select.ItemText>
                  </Select.Item>
                  <Select.Item className={s.selItem} value="drinks">
                    <Select.ItemText>{t("home.drinks")}</Select.ItemText>
                  </Select.Item>
                  <Select.Item className={s.selItem} value="desserts">
                    <Select.ItemText>{t("home.desserts")}</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Tablet/Desktop: Button bar */}
        <div className={s.homeCategories}>
          <button
            className={`${s.homeCatBtn} ${
              active === "meals" ? s.homeCatBtnActive : ""
            }`}
            onClick={() => setActive("meals")}
          >
            {t("home.meals")}
          </button>
          <button
            className={`${s.homeCatBtn} ${
              active === "drinks" ? s.homeCatBtnActive : ""
            }`}
            onClick={() => setActive("drinks")}
          >
            {t("home.drinks")}
          </button>
          <button
            className={`${s.homeCatBtn} ${
              active === "desserts" ? s.homeCatBtnActive : ""
            }`}
            onClick={() => setActive("desserts")}
          >
            {t("home.desserts")}
          </button>
        </div>

        {/* Ürün grid (örnek veriler) */}
        <div className={s.homeGrid}>
          <article className={s.homeCard}>
            <img
              className={s.homeCardImg}
              src="https://picsum.photos/400/250?1"
              alt={t("home.items.meatball")}
            />
            <h3 className={s.homeCardTitle}>{t("home.items.meatball")}</h3>
            <p className={s.homeCardPrice}>₺120</p>
            <button className={s.homeAddBtn}>{t("home.add")}</button>
          </article>

          <article className={s.homeCard}>
            <img
              className={s.homeCardImg}
              src="https://picsum.photos/400/250?2"
              alt={t("home.items.ayran")}
            />
            <h3 className={s.homeCardTitle}>{t("home.items.ayran")}</h3>
            <p className={s.homeCardPrice}>₺25</p>
            <button className={s.homeAddBtn}>{t("home.add")}</button>
          </article>

          <article className={s.homeCard}>
            <img
              className={s.homeCardImg}
              src="https://picsum.photos/400/250?3"
              alt={t("home.items.souffle")}
            />
            <h3 className={s.homeCardTitle}>{t("home.items.souffle")}</h3>
            <p className={s.homeCardPrice}>₺60</p>
            <button className={s.homeAddBtn}>{t("home.add")}</button>
          </article>
        </div>
      </section>

      {/* ===== CHEFS ===== */}
      <section className={s.chefs} aria-label="Chefs">
        <h2 className={s.sectionTitle}>{t("home.chefs_title")}</h2>
        <div className={s.chefsGrid}>
          <div className={s.chefCard}>
            <img className={s.chefImg} src={chef1} alt="Chef 1" />
            <h3 className={s.chefName}>Alex Morgan</h3>
            <p className={s.chefRole}>{t("home.chef_role")}</p>
          </div>
          <div className={s.chefCard}>
            <img className={s.chefImg} src={chef2} alt="Chef 2" />
            <h3 className={s.chefName}>Lina Ghosh</h3>
            <p className={s.chefRole}>{t("home.chef_role")}</p>
          </div>
          <div className={s.chefCard}>
            <img className={s.chefImg} src={chef3} alt="Chef 3" />
            <h3 className={s.chefName}>Marco Rossi</h3>
            <p className={s.chefRole}>{t("home.chef_role")}</p>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className={s.features} aria-label="Why choose us">
        <h2 className={s.sectionTitle}>{t("home.why_title")}</h2>
        <div className={s.featuresGrid}>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>⚡</div>
            <h3 className={s.featureTitle}>{t("home.why_fast")}</h3>
            <p className={s.featureText}>{t("home.why_fast_p")}</p>
          </div>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>🥗</div>
            <h3 className={s.featureTitle}>{t("home.why_fresh")}</h3>
            <p className={s.featureText}>{t("home.why_fresh_p")}</p>
          </div>
          <div className={s.featureCard}>
            <div className={s.featureIcon}>💳</div>
            <h3 className={s.featureTitle}>{t("home.why_secure")}</h3>
            <p className={s.featureText}>{t("home.why_secure_p")}</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={s.cta} aria-label="Reservation call">
        <h2 className={s.ctaTitle}>{t("home.cta_title")}</h2>
        <p className={s.ctaText}>{t("home.cta_text")}</p>
        <a className={s.ctaBtn} href="/cart">
          {t("home.cta_btn")}
        </a>
      </section>
    </main>
  );
}
