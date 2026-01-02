import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import s from "./QrGenerator.module.css";

export default function QrGenerator() {
  const { t } = useTranslation();
  const url = "https://qr-menuu.vercel.app/qr";

  const qrWrapRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert(t("qr.copied"));
    } catch {
      alert(t("qr.copy_error"));
    }
  };

  const handleDownload = () => {
    try {
      const canvas = qrWrapRef.current?.querySelector("canvas");
      if (!canvas) throw new Error("no-canvas");

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "qr-menu.png";
      a.click();
    } catch {
      alert(t("qr.download_error"));
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h2 className={s.title}>{t("qr.title")}</h2>
        <p className={s.sub}>{t("qr.subtitle")}</p>
        <div className={s.qrWrap} ref={qrWrapRef}>
          <div className={s.brand}>
            <div className={s.brandTitle}>FRIEND’S FIRST</div>
            <div className={s.brandSub}>QR MENU</div>
          </div>

          <QRCodeCanvas value={url} size={260} includeMargin />
        </div>

        <div className={s.urlBox}>
          <p className={s.url}>{url}</p>
        </div>

        <div className={s.actions}>
          <button type="button" className={s.btn} onClick={handleCopy}>
            {t("qr.copy")}
          </button>
          <button type="button" className={s.btn} onClick={handleDownload}>
            {t("qr.download")}
          </button>
        </div>

        <p className={s.hint}>{t("qr.hint")}</p>
      </div>
    </div>
  );
}
