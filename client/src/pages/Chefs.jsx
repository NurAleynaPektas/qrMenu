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
      name: t("home.chef1_name") || "Executive Chef",
      role: t("home.chef1_role") || "Executive Chef",
      image: chef1,
    },
    {
      id: "02",
      name: t("home.chef2_name") || "Sous Chef",
      role: t("home.chef2_role") || "Sous Chef",
      image: chef2,
    },
    {
      id: "03",
      name: t("home.chef3_name") || "Pastry Chef",
      role: t("home.chef3_role") || "Pastry Chef",
      image: chef3,
    },
  ];

  return (
    <main className={s.chefsPage}>
      <div className={s.container}>
        {/* HEADER */}
        <header className={s.header}>
          <div className={s.sectionTop}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>Meet the team</span>
            </div>

            <span className={s.sectionNumber}>01</span>
          </div>

          <div className={s.headerGrid}>
            <div>
              <p className={s.kicker}>Passion · Precision · Craft</p>

              <h1 className={s.title}>
                {t("home.chefs_title") || "Our Chefs"}
              </h1>
            </div>

            <div className={s.headerText}>
              <p className={s.lead}>
                Behind every plate is a team driven by curiosity, technique and
                respect for every ingredient.
              </p>

              <p className={s.description}>
                Our kitchen brings together craftsmanship and a modern approach
                to create a dining experience built around flavour, detail and
                simplicity.
              </p>
            </div>
          </div>
        </header>

        {/* CHEFS */}
        <section className={s.chefsGrid} aria-label="Our chefs">
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

        {/* PHILOSOPHY */}
        <section className={s.philosophy}>
          <div className={s.philosophyTop}>
            <span>Kitchen philosophy</span>
            <span>02</span>
          </div>

          <div className={s.philosophyContent}>
            <p className={s.philosophySmall}>Our approach</p>

            <h2 className={s.philosophyTitle}>
              Great food begins
              <br />
              with respect.
            </h2>

            <p className={s.philosophyText}>
              Respect for the ingredient, the season, the technique and the
              people gathered around the table. Our chefs focus on thoughtful
              cooking rather than unnecessary complexity.
            </p>
          </div>

          <div className={s.decorativeMark} aria-hidden="true">
            ✦
          </div>
        </section>
      </div>
    </main>
  );
}
