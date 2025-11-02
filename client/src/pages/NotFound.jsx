import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FuzzyText from "../components/FuzzyText";
import s from "./NotFound.module.css";
import { Link } from "react-router-dom";

export default function NotFound() {
  // i18n.js'te namespace 'translation' olduğu için boş bırakıyoruz
  const { t, i18n } = useTranslation();

  // Hover efektini yalnızca fare destekleyen cihazlarda etkinleştir
  const enableHover = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches ?? true
    );
  }, []);

  // Sayfa başlığını çeviriyle güncelle
  useEffect(() => {
    document.title = t("notFound.metaTitle");
  }, [i18n.language, t]);

  return (
    <main className={s.wrap} aria-labelledby="nf-title">
      <div className={s.center}>
        <FuzzyText
          baseIntensity={0.2}
          hoverIntensity={0.5}
          enableHover={enableHover}
          fontSize="clamp(3rem, 20vw, 14rem)"
          color="#fff"
          fontWeight={900}
        >
          404
        </FuzzyText>

        <h1 id="nf-title" className={s.title}>
          {t("notFound.title")}
        </h1>
        <p className={s.subtitle}>{t("notFound.subtitle")}</p>
        <Link to="/" className={s.btn}>
          {t("notFound.cta")}
        </Link>
      </div>
      <div aria-hidden className={s.bgGrad} />
    </main>
  );
}
