const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Table = require("../models/Table");

// POST /api/orders → yeni sipariş kaydet (MASA KİLİDİ VAR)
router.post("/", async (req, res) => {
  try {
    let { table, note, items } = req.body;

    const tableNumber = Number(table);
    if (!Number.isFinite(tableNumber) || tableNumber <= 0) {
      return res.status(400).json({ message: "Geçersiz masa numarası." });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Sepet boş." });
    }

    // 1) Masa FREE ise tek sorguda ACTIVE yap (kilit)
    const nowIso = new Date().toISOString();

    const lockedTable = await Table.findOneAndUpdate(
      { table: tableNumber, status: "FREE" },
      { $set: { status: "ACTIVE", updatedAt: nowIso } },
      { new: true }
    ).lean();

    if (!lockedTable) {
      // Masa ya yok, ya da ACTIVE
      const existing = await Table.findOne({ table: tableNumber }).lean();
      if (!existing)
        return res.status(404).json({ message: "Masa bulunamadı." });

      return res.status(409).json({
        message: `Masa ${tableNumber} zaten aktif. Yeni adisyon açılamaz.`,
        activeOrderId: existing.activeOrderId || null,
      });
    }

    // 2) Order oluştur
    const newOrder = await Order.create({
      id: Date.now().toString(),
      table: tableNumber,
      note: note || "",
      items,
      status: "pending",
      createdAt: nowIso,
    });

    // 3) Masaya activeOrderId yaz
    const tableAfter = await Table.findOneAndUpdate(
      { table: tableNumber },
      { $set: { activeOrderId: newOrder.id, updatedAt: nowIso } },
      { new: true }
    ).lean();

    return res.status(201).json({
      message: "Sipariş kaydedildi ve masa kilitlendi.",
      order: newOrder.toObject(),
      table: tableAfter,
    });
  } catch (err) {
    console.error("Order POST error:", err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

// PATCH /api/orders/:id/status → status güncelle (completed olunca masa aç)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "preparing", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Geçersiz status." });
    }

    const nowIso = new Date().toISOString();

    const order = await Order.findOneAndUpdate(
      { id },
      { $set: { status, updatedAt: nowIso } },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    // completed olduysa masayı aç
    if (status === "completed") {
      await Table.findOneAndUpdate(
        { table: Number(order.table) },
        { $set: { status: "FREE", activeOrderId: null, updatedAt: nowIso } },
        { new: true }
      ).lean();
    }

    return res.json({ message: "Status güncellendi.", order });
  } catch (err) {
    console.error("Order PATCH status error:", err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

// GET /api/orders → tüm siparişleri getir
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    console.error("Order GET error:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;
