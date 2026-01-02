import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import s from "./QrGenerator.module.css";

export default function QrGenerator() {
  const { t } = useTranslation();
  const url = "https://qr-menuu.vercel.app/qr";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert(t("qr.copied"));
    } catch {
      alert(t("qr.copy_error"));
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h2 className={s.title}>{t("qr.title")}</h2>
        <p className={s.sub}>{t("qr.subtitle")}</p>

        <div className={s.qrWrap}>
          <QRCodeCanvas value={url} size={280} includeMargin />
        </div>

        <div className={s.urlBox}>
          <p className={s.url}>{url}</p>
          <button type="button" className={s.copyBtn} onClick={handleCopy}>
            {t("qr.copy")}
          </button>
        </div>

        <p className={s.hint}>{t("qr.hint")}</p>
      </div>
    </div>
  );
}
