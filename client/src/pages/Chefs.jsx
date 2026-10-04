import { useTranslation } from "react-i18next";
import s from "./Chefs.module.css";

import chef1 from "../assets/chef1.png";
import chef2 from "../assets/chef2.png";
import chef3 from "../assets/chef3.png";

export default function Chefs() {
  const { t } = useTranslation();

  const chefs = [
    {
      id: "01",
      name: t("chefs.chef1_name"),
      role: t("chefs.chef1_role"),
      image: chef1,
    },
    {
      id: "02",
      name: t("chefs.chef2_name"),
      role: t("chefs.chef2_role"),
      image: chef2,
    },
    {
      id: "03",
      name: t("chefs.chef3_name"),
      role: t("chefs.chef3_role"),
      image: chef3,
    },
  ];

  return (
    <main className={s.chefsPage}>
      <div className={s.container}>
        {/* ================================================
            HEADER
        ================================================ */}

        <header className={s.header}>
          <div className={s.sectionTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>{t("chefs.eyebrow")}</span>
            </div>

            <span className={s.sectionNumber}>01</span>
          </div>

          <div className={s.headerGrid}>
            <div>
              <p className={s.kicker}>{t("chefs.kicker")}</p>

              <h1 className={s.title}>{t("home.chefs_title")}</h1>
            </div>

            <div className={s.headerText}>
              <p className={s.lead}>{t("chefs.lead")}</p>

              <p className={s.description}>{t("chefs.description")}</p>
            </div>
          </div>
        </header>

        {/* ================================================
            CHEFS
        ================================================ */}

        <section className={s.chefsGrid} aria-label={t("chefs.aria_label")}>
          {chefs.map((chef) => (
            <article className={s.chefCard} key={chef.id}>
              <div className={s.imageWrap}>
                <img src={chef.image} alt={chef.name} className={s.chefImage} />

                <div className={s.imageOverlay} />

                <span className={s.imageNumber}>{chef.id}</span>
              </div>

              <div className={s.chefInfo}>
                <div>
                  <h2 className={s.chefName}>{chef.name}</h2>

                  <p className={s.chefRole}>{chef.role}</p>
                </div>

                <span className={s.chefMark} aria-hidden="true">
                  ✦
                </span>
              </div>
            </article>
          ))}
        </section>

        {/* ================================================
            PHILOSOPHY
        ================================================ */}

        <section className={s.philosophy}>
          <div className={s.philosophyTop}>
            <span>{t("chefs.philosophy_label")}</span>
            <span>02</span>
          </div>

          <div className={s.philosophyContent}>
            <p className={s.philosophySmall}>{t("chefs.approach")}</p>

            <h2 className={s.philosophyTitle}>
              {t("chefs.philosophy_title_1")}
              <br />
              {t("chefs.philosophy_title_2")}
            </h2>

            <p className={s.philosophyText}>{t("chefs.philosophy_text")}</p>
          </div>

          <div className={s.decorativeMark} aria-hidden="true">
            ✦
          </div>
        </section>
      </div>
    </main>
  );
}
