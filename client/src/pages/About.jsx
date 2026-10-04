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
              <span>Our Story</span>
            </div>

            <span className={s.sectionNumber}>01</span>
          </div>

          <div className={s.introGrid}>
            <div className={s.introHeading}>
              <p className={s.kicker}>Taste · Craft · Experience</p>

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
              alt="Restaurant dining atmosphere"
              className={s.image}
            />

            <div className={s.imageOverlay} />

            <div className={s.established}>
              <span>Established</span>
              <strong>2026</strong>
            </div>
          </div>

          <div className={s.storyBottom}>
            <span className={s.storyLabel}>Modern dining</span>

            <p className={s.storyQuote}>
              More than a meal — an experience shaped by detail, atmosphere and
              thoughtful cuisine.
            </p>
          </div>
        </section>

        {/* ================================================
            PHILOSOPHY
        ================================================ */}
        <section className={s.philosophy}>
          <div className={s.sectionTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>Our Philosophy</span>
            </div>

            <span className={s.sectionNumber}>02</span>
          </div>

          <div className={s.philosophyGrid}>
            <div className={s.philosophyIntro}>
              <h2 className={s.philosophyTitle}>
                Simple ingredients.
                <br />
                Memorable moments.
              </h2>
            </div>

            <div className={s.values}>
              <article className={s.value}>
                <span className={s.valueNumber}>01</span>

                <div>
                  <h3>Seasonal</h3>
                  <p>Ingredients selected with the season in mind.</p>
                </div>
              </article>

              <article className={s.value}>
                <span className={s.valueNumber}>02</span>

                <div>
                  <h3>Craft</h3>
                  <p>Every plate is prepared with precision and care.</p>
                </div>
              </article>

              <article className={s.value}>
                <span className={s.valueNumber}>03</span>

                <div>
                  <h3>Atmosphere</h3>
                  <p>A warm setting designed around the dining experience.</p>
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
            <span className={s.ctaEyebrow}>Discover our kitchen</span>

            <h2 className={s.ctaTitle}>
              Ready to taste
              <br />
              our story?
            </h2>

            <Link to="/menu" className={s.ctaLink}>
              <span>Explore the menu</span>

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
