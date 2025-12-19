const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const Menu = require("../models/Menu");

// uploads klasörü (yoksa oluştur)
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_-]/g, "");
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new Error("Only jpg/png/webp allowed"), false);
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

//  GET /api/menu → tüm menü
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: 1 }).lean();
    res.json(menu);
  } catch (err) {
    console.error("Menu GET error:", err);
    res.status(500).json({ message: "Menu load error" });
  }
});

//  POST /api/menu/upload → sadece resim yükle (opsiyonel ama çok işe yarar)
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // DB'ye kaydetmek için en sağlıklısı: sadece path
    const img = `/uploads/${req.file.filename}`;
    res.json({ img });
  } catch (err) {
    console.error("Menu UPLOAD error:", err);
    res.status(500).json({ message: "Upload error" });
  }
});

//  POST /api/menu → yeni ürün ekle (FormData ile img gönderebilirsin)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category, available = "true", nameKey } = req.body;

    // 1) FormData ile img geldi mi?
    let imgPath = null;
    if (req.file) imgPath = `/uploads/${req.file.filename}`;

    // 2) json body ile img path/url yolladıysa (cloudinary vs)
    if (!imgPath && req.body.img) imgPath = String(req.body.img);

    const isAvailable =
      typeof available === "string"
        ? available !== "false"
        : Boolean(available);

    const doc = await Menu.create({
      id: req.body.id || `M-${Date.now()}`,
      name: name || "Menu item",
      nameKey: nameKey || null,
      price: Number(price) || 0,
      category: category || "General",
      available: isAvailable,
      img: imgPath || `https://picsum.photos/400/250?random=${Date.now()}`,
    });

    res.status(201).json(doc.toObject());
  } catch (err) {
    console.error("Menu POST error:", err);
    res.status(500).json({ message: "Menu save error" });
  }
});

// PUT /api/menu/:id → ürünü güncelle
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body || {};

    const existing = await Menu.findOne({ id });
    if (!existing)
      return res.status(404).json({ message: "Menu item not found" });

    let nextImg = existing.img;

    // yeni resim yüklendiyse
    if (req.file) nextImg = `/uploads/${req.file.filename}`;
    // json ile img yollandıysa
    else if (changes.img) nextImg = String(changes.img);

    const nextAvailable =
      changes.available !== undefined
        ? changes.available === "false"
          ? false
          : Boolean(changes.available)
        : existing.available;

    const updated = await Menu.findOneAndUpdate(
      { id },
      {
        ...changes,
        price:
          changes.price !== undefined ? Number(changes.price) : existing.price,
        img: nextImg,
        available: nextAvailable,
      },
      { new: true }
    ).lean();

    res.json(updated);
  } catch (err) {
    console.error("Menu PUT error:", err);
    res.status(500).json({ message: "Menu update error" });
  }
});

//  DELETE /api/menu/:id → ürünü sil
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Menu.findOneAndDelete({ id }).lean();
    if (!deleted)
      return res.status(404).json({ message: "Menu item not found" });

    res.json({ id });
  } catch (err) {
    console.error("Menu DELETE error:", err);
    res.status(500).json({ message: "Menu delete error" });
  }
});

module.exports = router;
