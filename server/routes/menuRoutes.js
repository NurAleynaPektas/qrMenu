const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const Menu = require("../models/Menu");

// Multer storage ayarı
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage });

// GET /api/menu → tüm menüyü getir (Mongo)
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find().sort({ createdAt: 1 }).lean();
    res.json(menu);
  } catch (err) {
    console.error("Menu GET error:", err);
    res.status(500).json({ message: "Menu load error" });
  }
});

// POST /api/menu → yeni ürün ekle (Mongo)
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category, available = "true", nameKey } = req.body;

    let imgUrl = null;
    if (req.file) {
      imgUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else if (req.body.img) {
      imgUrl = req.body.img;
    }

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

// PUT /api/menu/:id → ürünü güncelle (Mongo)
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body || {};

    const existing = await Menu.findOne({ id });
    if (!existing)
      return res.status(404).json({ message: "Menu item not found" });

    let imgUrl = existing.img;

    if (req.file) {
      imgUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else if (changes.img) {
      imgUrl = changes.img;
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

// DELETE /api/menu/:id → ürünü sil (Mongo)
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
