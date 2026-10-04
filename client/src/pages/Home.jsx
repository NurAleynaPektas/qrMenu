import { useTranslation } from "react-i18next";
import s from "./Home.module.css";

import heroImg from "../assets/hero.png";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className={s.homePage}>
      <section className={s.hero} aria-label={t("home.hero_aria")}>
        {/* BACKGROUND */}
        <div className={s.heroMedia}>
          <img
            src={heroImg}
            alt={t("home.hero_image_alt")}
            className={s.heroImage}
          />

          <div className={s.heroOverlay} />
        </div>

        {/* TOP DETAILS */}
        <div className={s.heroTop}>
          <div className={s.heroEyebrow}>
            <span className={s.heroLine} />
            <span>{t("home.hero_eyebrow")}</span>
          </div>

          <span className={s.heroLocation}>{t("home.hero_location")}</span>
        </div>

        {/* MAIN CONTENT */}
        <div className={s.heroContent}>
          <p className={s.heroKicker}>{t("home.hero_kicker")}</p>

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

            <span className={s.heroDetailText}>
              {t("home.detail_seasonal")}
            </span>
          </div>

          <div className={s.heroDetail}>
            <span className={s.heroDetailNumber}>02</span>

            <span className={s.heroDetailText}>{t("home.detail_crafted")}</span>
          </div>

          <div className={s.heroDetail}>
            <span className={s.heroDetailNumber}>03</span>

            <span className={s.heroDetailText}>
              {t("home.detail_memorable")}
            </span>
          </div>

          <div className={s.heroSignature}>
            <span>{t("home.established")}</span>
            <strong>2026</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
