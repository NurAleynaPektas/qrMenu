const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

if (!admin.apps.length) {
  // 1) Render için: ENV’den dene
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const serviceAccount = JSON.parse(raw);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized from ENV");
    } catch (e) {
      console.error("FIREBASE_SERVICE_ACCOUNT_JSON parse error:", e.message);
    }
  }

  // 2) Lokal için: dosya varsa kullan
  if (!admin.apps.length) {
    const filePath = path.join(__dirname, "serviceAccountKey.json");
    if (fs.existsSync(filePath)) {
      const serviceAccount = require(filePath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("Firebase Admin initialized from file");
    }
  }

  // 3) Hâlâ init olmadıysa: crash etme
  if (!admin.apps.length) {
    console.warn(
      "Firebase Admin NOT initialized. Set FIREBASE_SERVICE_ACCOUNT_JSON on Render.",
    );
  }
}

module.exports = admin;
