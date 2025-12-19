const API_BASE = import.meta.env.VITE_API_URL;

export function resolveImageUrl(img, fallbackKey = "1") {
  if (!img) {
    return `https://picsum.photos/400/250?random=${fallbackKey}`;
  }

  const url = String(img);

  // "/uploads/xxx.jpg"
  if (url.startsWith("/uploads/")) {
    return `${API_BASE}${url}`;
  }

  // eski localhost kayıtları
  if (url.startsWith("http://localhost:5000")) {
    return url.replace("http://localhost:5000", API_BASE);
  }

  // tam URL ise
  if (url.startsWith("http")) {
    return url;
  }

  // sadece dosya adıysa
  return `${API_BASE}/uploads/${url}`;
}
