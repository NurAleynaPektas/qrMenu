import { useTranslation } from "react-i18next";
import s from "./Home.module.css";

import HeroDeck from "../components/HeroDeck";
import her from "../assets/her.png";
import heroImg from "../assets/hero.png";
import diningImg from "../assets/dining.png";
import chef1 from "../assets/chef1.png";
import chef2 from "../assets/chef2.png";
import chef3 from "../assets/chef3.png";
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";

export default function Home() {
  const { t } = useTranslation();

  const slides = [
    { src: heroImg, alt: "Restaurant ambience" },
    { src: diningImg, alt: "Dining table" },
    { src: hero1, alt: "Dining table" },
    { src: hero2, alt: "Dining table" },
  ];

  return (
    <main className={s.homePage}>
      {/* HERO */}
      <section className={s.heroWrap} aria-label="Hero">
        <HeroDeck
          slides={slides}
          title={t("home.hero_title")}
          subtitle={t("home.hero_sub")}
          ctaText={t("home.hero_cta")}
          ctaHref="/menu"
        />
      </section>

      {/* ABOUT */}
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

      {/*CHEFS */}
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

      {/* WHY CHOOSE US  */}
      <section className={s.features} aria-label="Why choose us">
        <h2 className={s.sectionTitle}>{t("home.why_title")}</h2>
        <div className={s.featuresGrid}>
          {/* Kart 1 - Fast & Fresh */}
          <div
            className={s.featureCard}
            style={{ "--feature-bg": `url(${hero2})` }}
          >
            <div className={s.featureInner}>
              <div className={s.featureFront}>
                <div className={s.featureIcon}>⚡</div>
                <h3 className={s.featureTitle}>{t("home.why_fast")}</h3>
                <p className={s.featureText}>{t("home.why_fast_p")}</p>
              </div>
              {/* Arka taraf: sadece görsel */}
              <div className={s.featureBack} aria-hidden="true" />
            </div>
          </div>

          {/* Kart 2 - Seasonal & Local */}
          <div
            className={s.featureCard}
            style={{ "--feature-bg": `url(${heroImg})` }}
          >
            <div className={s.featureInner}>
              <div className={s.featureFront}>
                <div className={s.featureIcon}>🥗</div>
                <h3 className={s.featureTitle}>{t("home.why_fresh")}</h3>
                <p className={s.featureText}>{t("home.why_fresh_p")}</p>
              </div>
              <div className={s.featureBack} aria-hidden="true" />
            </div>
          </div>

          {/* Kart 3 - Secure Payment */}
          <div
            className={s.featureCard}
            style={{ "--feature-bg": `url(${diningImg})` }}
          >
            <div className={s.featureInner}>
              <div className={s.featureFront}>
                <div className={s.featureIcon}>💳</div>
                <h3 className={s.featureTitle}>{t("home.why_secure")}</h3>
                <p className={s.featureText}>{t("home.why_secure_p")}</p>
              </div>
              <div className={s.featureBack} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/*  CTA */}
      <section aria-label="Reservation call">
        <div className={s.cta}>
          <div className={s.ctaImageWrap}>
            <img src={her} className={s.chefImg} alt="logo" />
          </div>
          <div className={s.ctaTextWrap}>
            <h2 className={s.ctaTitle}>{t("home.cta_title")}</h2>
            <p className={s.ctaText}>{t("home.cta_text")}</p>
            <a className={s.ctaBtn} href="/menu">
              {t("home.cta_btn")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
