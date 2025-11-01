import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import s from "./Home.module.css";

// Görseller
import heroImg from "../assets/hero.png";
import diningImg from "../assets/dining.png";
import chef1 from "../assets/chef1.png";
import chef2 from "../assets/chef2.png";
import chef3 from "../assets/chef3.png";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";

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
        <div className={s.heroOverlay} />

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

        <div className={s.heroInner}>
          <h1 className={s.heroTitle}>{t("home.hero_title")}</h1>
          <p className={s.heroSubtitle}>{t("home.hero_sub")}</p>
          <a className={s.heroBtn} href="/menu">
            {t("home.hero_cta")}
          </a>
        </div>

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

      {/* ===== CTA (Sipariş Verme) ===== */}
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
