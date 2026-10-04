import { useTranslation } from "react-i18next";
import s from "./Home.module.css";

import heroImg from "../assets/hero.png";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className={s.homePage}>
      <section className={s.hero} aria-label="Restaurant introduction">
        {/* BACKGROUND */}
        <div className={s.heroMedia}>
          <img
            src={heroImg}
            alt="Elegant restaurant dining experience"
            className={s.heroImage}
          />

          <div className={s.heroOverlay} />
        </div>

        {/* TOP DETAILS */}
        <div className={s.heroTop}>
          <div className={s.heroEyebrow}>
            <span className={s.heroLine} />
            <span>Modern Dining</span>
          </div>

          <span className={s.heroLocation}>Istanbul · 2026</span>
        </div>

        {/* MAIN CONTENT */}
        <div className={s.heroContent}>
          <p className={s.heroKicker}>Taste · Atmosphere · Experience</p>

          <h1 className={s.heroTitle}>{t("home.hero_title")}</h1>

          <p className={s.heroSubtitle}>{t("home.hero_sub")}</p>

          <div className={s.heroActions}>
            <a className={s.heroPrimary} href="/menu">
              <span>{t("home.hero_cta")}</span>
              <span className={s.heroActionArrow} aria-hidden="true">
                ↗
              </span>
            </a>

  
          </div>
        </div>

        {/* BOTTOM DETAILS */}
        <div className={s.heroFooter}>
          <div className={s.heroDetail}>
            <span className={s.heroDetailNumber}>01</span>

            <span className={s.heroDetailText}>Seasonal ingredients</span>
          </div>

          <div className={s.heroDetail}>
            <span className={s.heroDetailNumber}>02</span>

            <span className={s.heroDetailText}>Crafted with care</span>
          </div>

          <div className={s.heroDetail}>
            <span className={s.heroDetailNumber}>03</span>

            <span className={s.heroDetailText}>Memorable evenings</span>
          </div>

          <div className={s.heroSignature}>
            <span>EST.</span>
            <strong>2026</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
