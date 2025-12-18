const express = require("express");
const router = express.Router();

const { readJson, writeJson } = require("../utils/fileDB");
const path = require("path");
const ORDERS_PATH = path.join(__dirname, "..", "data", "orders.json");
const TABLES_PATH = path.join(__dirname, "..", "data", "tables.json");

// POST /api/orders → yeni sipariş kaydet (MASA KİLİDİ VAR)
router.post("/", async (req, res) => {
  try {
    let { table, note, items } = req.body;

    // table: number olmalı
    const tableNumber = Number(table);
    if (!Number.isFinite(tableNumber) || tableNumber <= 0) {
      return res.status(400).json({ message: "Geçersiz masa numarası." });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Sepet boş." });
    }

    // 1) Tables oku ve masa kilidi kontrol et
    const tables = await readJson(TABLES_PATH);
    const tableEntry = tables.find((t) => Number(t.table) === tableNumber);

    if (!tableEntry) {
      return res.status(404).json({ message: "Masa bulunamadı." });
    }

    if (tableEntry.status === "ACTIVE") {
      return res.status(409).json({
        message: `Masa ${tableNumber} zaten aktif. Yeni adisyon açılamaz.`,
        activeOrderId: tableEntry.activeOrderId || null,
      });
    }

    // 2) Order oluştur
    const orders = await readJson(ORDERS_PATH);

    const newOrder = {
      id: Date.now().toString(),
      table: tableNumber,
      note: note || "",
      items,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    await writeJson(ORDERS_PATH, orders);

    // 3) Masa kilitle
    tableEntry.status = "ACTIVE";
    tableEntry.activeOrderId = newOrder.id;
    tableEntry.updatedAt = new Date().toISOString();

    await writeJson(TABLES_PATH, tables);

    return res.status(201).json({
      message: "Sipariş kaydedildi ve masa kilitlendi.",
      order: newOrder,
      table: tableEntry,
    });
  } catch (err) {
    console.error("Order POST error:", err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});
// PATCH /api/orders/:id/status → sipariş status güncelle (completed olunca masa aç)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "preparing", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Geçersiz status." });
    }

    const orders = await readJson(ORDERS_PATH);
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Sipariş bulunamadı." });
    }

    // status güncelle
    orders[index].status = status;
    orders[index].updatedAt = new Date().toISOString();
    await writeJson(ORDERS_PATH, orders);

    // completed olduysa masayı aç
    if (status === "completed") {
      const tableNumber = Number(orders[index].table);

      const tables = await readJson(TABLES_PATH);
      const tableEntry = tables.find((t) => Number(t.table) === tableNumber);

      if (tableEntry) {
        tableEntry.status = "FREE";
        tableEntry.activeOrderId = null;
        tableEntry.updatedAt = new Date().toISOString();
        await writeJson(TABLES_PATH, tables);
      }
    }

    return res.json({ message: "Status güncellendi.", order: orders[index] });
  } catch (err) {
    console.error("Order PATCH status error:", err);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
});

// GET /api/orders → tüm siparişleri getir (admin/chef kullanacak)
router.get("/", async (req, res) => {
  try {
    const orders = await readJson(ORDERS_PATH);
    res.json(orders);
  } catch (err) {
    console.error("Order GET error:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router;
