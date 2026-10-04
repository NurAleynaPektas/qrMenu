import { useTranslation } from "react-i18next";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

import s from "./Footer.module.css";

export default function Footer() {
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        {/* =============================================
            TOP
        ============================================= */}

        <div className={s.top}>
          <div className={s.brandArea}>
            <div className={s.eyebrow}>
              <span className={s.eyebrowLine} />
              <span>{t("footer.restaurant")}</span>
            </div>

            <p className={s.brand}>Friend's First</p>

            <p className={s.tagline}>{t("footer.tagline")}</p>
          </div>

          <button
            type="button"
            className={s.backToTop}
            onClick={scrollToTop}
            aria-label={t("footer.back_to_top")}
          >
            <span>{t("footer.back_to_top")}</span>
            <ArrowUp size={16} strokeWidth={1.6} />
          </button>
        </div>

        {/* =============================================
            BOTTOM
        ============================================= */}

        <div className={s.bottom}>
          <div className={s.copyright}>
            <span>© {currentYear}</span>
            <span className={s.separator}>·</span>
            <span>Friend's First</span>
          </div>

          <p className={s.made}>
            {t("footer.made_by")} <span>Nur Aleyna PEKTAŞ</span>
          </p>

          <div className={s.socials} aria-label={t("footer.social_links")}>
            <a
              href="mailto:nuraleynaaaa@gmail.com"
              className={s.socialLink}
              aria-label={t("footer.email")}
              title={t("footer.email")}
            >
              <Mail size={18} strokeWidth={1.5} />
            </a>

            <a
              href="https://github.com/NurAleynaPektas"
              target="_blank"
              rel="noreferrer"
              className={s.socialLink}
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={18} strokeWidth={1.5} />
            </a>

            <a
              href="https://www.linkedin.com/in/nur-aleyna-pekta%C5%9F-16b401332/"
              target="_blank"
              rel="noreferrer"
              className={s.socialLink}
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
