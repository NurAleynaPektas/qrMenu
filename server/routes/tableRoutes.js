const express = require("express");
const router = express.Router();

const Table = require("../models/Table");

// GET /api/tables  → tüm masaları getir (Mongo)
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ table: 1 }).lean();
    return res.json(tables);
  } catch (err) {
    console.error("Tables GET error:", err);
    return res.status(500).json({ message: "Tables load error" });
  }
});

// PATCH /api/tables/:table/free  → masayı FREE yap
router.patch("/:table/free", async (req, res) => {
  try {
    const tableNumber = Number(req.params.table);
    if (!Number.isFinite(tableNumber) || tableNumber <= 0) {
      return res.status(400).json({ message: "Geçersiz masa numarası." });
    }

    const nowIso = new Date().toISOString();

    const updated = await Table.findOneAndUpdate(
      { table: tableNumber },
      { $set: { status: "FREE", activeOrderId: null, updatedAt: nowIso } },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ message: "Masa bulunamadı." });

    return res.json({ message: "Masa FREE yapıldı.", table: updated });
  } catch (err) {
    console.error("Tables PATCH free error:", err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;
