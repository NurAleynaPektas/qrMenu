import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import s from "./About.module.css";
import diningImg from "../assets/dining.png";

export default function About() {
  const { t } = useTranslation();

  return (
    <main className={s.aboutPage}>
      <div className={s.container}>
        {/* ================================================
            INTRO
        ================================================ */}
        <section className={s.intro}>
          <div className={s.sectionTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>{t("about.story")}</span>
            </div>

            <span className={s.sectionNumber}>01</span>
          </div>

          <div className={s.introGrid}>
            <div className={s.introHeading}>
              <p className={s.kicker}>{t("about.kicker")}</p>

              <h1 className={s.title}>{t("home.about_title")}</h1>
            </div>

            <div className={s.introText}>
              <p className={s.lead}>{t("home.about_p1")}</p>

              <p className={s.description}>{t("home.about_p2")}</p>
            </div>
          </div>
        </section>

        {/* ================================================
            MAIN VISUAL
        ================================================ */}
        <section className={s.story}>
          <div className={s.imageWrap}>
            <img
              src={diningImg}
              alt={t("about.image_alt")}
              className={s.image}
            />

            <div className={s.imageOverlay} />

            <div className={s.established}>
              <span>{t("about.established")}</span>
              <strong>2026</strong>
            </div>
          </div>

          <div className={s.storyBottom}>
            <span className={s.storyLabel}>{t("about.modern_dining")}</span>

            <p className={s.storyQuote}>{t("about.story_quote")}</p>
          </div>
        </section>

        {/* ================================================
            PHILOSOPHY
        ================================================ */}
        <section className={s.philosophy}>
          <div className={s.sectionTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>{t("about.philosophy")}</span>
            </div>

            <span className={s.sectionNumber}>02</span>
          </div>

          <div className={s.philosophyGrid}>
            <div className={s.philosophyIntro}>
              <h2 className={s.philosophyTitle}>
                {t("about.philosophy_title_1")}
                <br />
                {t("about.philosophy_title_2")}
              </h2>
            </div>

            <div className={s.values}>
              <article className={s.value}>
                <span className={s.valueNumber}>01</span>

                <div>
                  <h3>{t("about.seasonal_title")}</h3>
                  <p>{t("about.seasonal_text")}</p>
                </div>
              </article>

              <article className={s.value}>
                <span className={s.valueNumber}>02</span>

                <div>
                  <h3>{t("about.craft_title")}</h3>
                  <p>{t("about.craft_text")}</p>
                </div>
              </article>

              <article className={s.value}>
                <span className={s.valueNumber}>03</span>

                <div>
                  <h3>{t("about.atmosphere_title")}</h3>
                  <p>{t("about.atmosphere_text")}</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================================================
            MENU CTA
        ================================================ */}
        <section className={s.cta}>
          <div className={s.ctaContent}>
            <span className={s.ctaEyebrow}>{t("about.cta_eyebrow")}</span>

            <h2 className={s.ctaTitle}>
              {t("about.cta_title_1")}
              <br />
              {t("about.cta_title_2")}
            </h2>

            <Link to="/menu" className={s.ctaLink}>
              <span>{t("about.cta_link")}</span>

              <ArrowUpRight size={18} strokeWidth={1.6} />
            </Link>
          </div>

          <span className={s.ctaMark} aria-hidden="true">
            ✦
          </span>
        </section>
      </div>
    </main>
  );
}
