const express = require("express");
const router = express.Router();

const { readJson, writeJson } = require("../utils/fileDB");

// POST /api/orders → yeni sipariş kaydet
router.post("/", async (req, res) => {
  try {
    const { table, note, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Sepet boş." });
    }

    const orders = await readJson("data/orders.json");

    const newOrder = {
      id: Date.now().toString(),
      table: table || "Unknown table",
      note: note || "",
      items,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    await writeJson("data/orders.json", orders);

    res.status(201).json({
      message: "Sipariş kaydedildi.",
      order: newOrder,
    });
  } catch (err) {
    console.error("Order POST error:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

// GET /api/orders → tüm siparişleri getir (admin kullanacak)
router.get("/", async (req, res) => {
  try {
    const orders = await readJson("data/orders.json");
    res.json(orders);
  } catch (err) {
    console.error("Order GET error:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;
