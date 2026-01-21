# QRMenu – Friend’s First

QRMenu, restoranlar için **QR kod ile menü görüntüleme ve sipariş verme** deneyimi sunan modern bir web uygulamasıdır.  
Uygulama; **Admin**, **Kitchen** ve ziyaretçi (müşteri) akışlarını içeren **rol bazlı** bir yapı ile geliştirilmiştir.

## 🔗 Canlı Demo
- Frontend: https://qr-menuu.vercel.app
- QR Menü: https://qr-menuu.vercel.app/qr
- Backend: Render (uyku modlu)

> ⚠️ **Önemli:**  
> Backend ücretsiz sunucuda çalıştığı için ilk istekte **uykudan uyanması 10–30 saniye sürebilir**.  
> Lütfen sayfa açılırken biraz sabırlı olun

## ✨ Özellikler
- QR kod ile menüye erişim
- Ürün listeleme 
- Rol bazlı kimlik doğrulama (Protected Routes)
- **Staff Panel**
  - Sepete ekleme
  - Sipariş oluşturma
- **Admin Panel**
  - Menü yönetimi
  - Siparişleri görüntüleme ve durum güncelleme
- **Kitchen Panel**
  - Gelen siparişleri takip etme
  - Admin ile haberleşme
- Responsive tasarım (mobil / tablet / desktop)

## 🔐 Gizli Giriş Rotaları
Bu sayfalar navbar’da görünmez:
### 🧪 Demo Hesapları
**Admin**
- Admin Login: `https://qr-menuu.vercel.app/admin/login`
- Email: `admin@friendsfirst.com`
- Şifre: `admin123`

**Kitchen**
- Kitchen Login: `https://qr-menuu.vercel.app/kitchen/login`
- Email: `kitchen@friendsfirst.com`
- Şifre: `kitchen123`

## 🛠️ Kullanılan Teknolojiler
- React
- Redux Toolkit
- React Router (Protected Routes)
- Node.js & Express
- MongoDB
- Multer (görsel upload)
- Vercel (Frontend)
- Render (Backend)

## 🚀 Kurulum
```bash
npm install
npm run dev
