import { QRCodeCanvas } from "qrcode.react";
import s from "./QrGenerator.module.css";

export default function QrGenerator() {
  const url = "https://qr-menuu.vercel.app/qr";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Kopyalandı!");
    } catch {
      alert("Kopyalanamadı");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <h2 className={s.title}>QR Menu Kodu</h2>
        <p className={s.sub}>QR okutulunca direkt menü açılır.</p>

        <div className={s.qrWrap}>
          <QRCodeCanvas value={url} size={280} includeMargin />
        </div>

        <div className={s.urlBox}>
          <p className={s.url}>{url}</p>
          <button type="button" className={s.copyBtn} onClick={handleCopy}>
            Kopyala
          </button>
        </div>

        <p className={s.hint}>Telefonla QR’ı okutmayı dene.</p>
      </div>
    </div>
  );
}
