const express = require("express");
const router = express.Router();
const multer = require("multer");
const Menu = require("../models/Menu");

const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer: memory storage (dosyayı diske yazmadan RAM'de tutar)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Buffer -> data URI
function bufferToDataURI(file) {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
}

// GET /api/menu
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: 1 }).lean();
    res.json(menu);
  } catch (err) {
    console.error("Menu GET error:", err);
    res.status(500).json({ message: "Menu load error" });
  }
});

// POST /api/menu (Cloudinary upload)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category, available = "true", nameKey } = req.body;

    let imgUrl = null;

    // 1) FormData ile img geldiyse Cloudinary'ye yükle
    if (req.file) {
      const dataUri = bufferToDataURI(req.file);

      const uploadRes = await cloudinary.uploader.upload(dataUri, {
        folder: "friends-first/menu",
        resource_type: "image",
      });

      imgUrl = uploadRes.secure_url; // ✅ kalıcı, https
    }

    // 2) Eğer json body ile img yollandıysa (external url vs)
    if (!imgUrl && req.body.img) imgUrl = String(req.body.img);

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
      img: imgUrl || `https://picsum.photos/400/250?random=${Date.now()}`,
    });

    res.status(201).json(doc.toObject());
  } catch (err) {
    console.error("Menu POST error:", err);
    res.status(500).json({ message: "Menu save error" });
  }
});

// PUT /api/menu/:id (Cloudinary upload)
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body || {};

    const existing = await Menu.findOne({ id });
    if (!existing)
      return res.status(404).json({ message: "Menu item not found" });

    let imgUrl = existing.img;

    // yeni resim geldiyse Cloudinary'ye yükle
    if (req.file) {
      const dataUri = bufferToDataURI(req.file);

      const uploadRes = await cloudinary.uploader.upload(dataUri, {
        folder: "friends-first/menu",
        resource_type: "image",
      });

      imgUrl = uploadRes.secure_url;
    } else if (changes.img) {
      imgUrl = String(changes.img);
    }

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
        img: imgUrl,
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

// DELETE /api/menu/:id
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
