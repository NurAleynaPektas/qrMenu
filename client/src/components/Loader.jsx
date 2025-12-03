import s from "./Loader.module.css";
import { useTranslation } from "react-i18next";

export default function Loader() {
  const { t } = useTranslation();

  return (
    <div className={s.backdrop}>
      <div className={s.wrapper}>
        {/* TABAK */}
        <div className={s.plateWrapper}>
          {/* Gölge */}
          <div className={s.shadow}></div>

          <div className={s.plate}>
            <div className={s.plateInner}></div>

            {/* DÖKÜLEN SOS / YEMEK */}
            <div className={s.stream}></div>

            {/* Damlalar */}
            <div className={s.drop}></div>
            <div className={`${s.drop} ${s.drop2}`}></div>
            <div className={`${s.drop} ${s.drop3}`}></div>
          </div>

          {/* KAŞIK / TAVA GİBİ ÜST PARÇA */}
          <div className={s.handle}></div>
        </div>

        {/* LOADER METNİ (i18n) */}
        <p className={s.text}>{t("loader.loading")}</p>
      </div>
    </div>
  );
}
