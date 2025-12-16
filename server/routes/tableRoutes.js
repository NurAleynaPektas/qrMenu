const express = require("express");
const router = express.Router();
const { readJson, writeJson } = require("../utils/fileDB");

const TABLES_PATH = "data/tables.json";

// GET /api/tables
router.get("/", async (req, res) => {
  try {
    const tables = await readJson(TABLES_PATH);
    return res.json(tables);
  } catch (err) {
    console.error("Tables GET error:", err);
    return res.status(500).json({ message: "Tables load error" });
  }
});

// PATCH /api/tables/:table/free  
router.patch("/:table/free", async (req, res) => {
  try {
    const tableNumber = Number(req.params.table);
    if (!Number.isFinite(tableNumber) || tableNumber <= 0) {
      return res.status(400).json({ message: "Geçersiz masa numarası." });
    }

    const tables = await readJson(TABLES_PATH);
    const entry = tables.find((t) => Number(t.table) === tableNumber);
    if (!entry) return res.status(404).json({ message: "Masa bulunamadı." });

    entry.status = "FREE";
    entry.activeOrderId = null;
    entry.updatedAt = new Date().toISOString();

    await writeJson(TABLES_PATH, tables);
    return res.json({ message: "Masa FREE yapıldı.", table: entry });
  } catch (err) {
    console.error("Tables PATCH free error:", err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;
