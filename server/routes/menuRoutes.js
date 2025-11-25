const express = require("express");
const router = express.Router();
const { readJson, writeJson } = require("../utils/fileDb");

const MENU_PATH = "data/menu.json";

// GET /api/menu → tüm menüyü getir
router.get("/", async (req, res) => {
  try {
    const menu = await readJson(MENU_PATH);
    res.json(menu);
  } catch (err) {
    console.error("Menu GET error:", err);
    res.status(500).json({ message: "Menu load error" });
  }
});

// POST /api/menu → yeni ürün ekle
router.post("/", async (req, res) => {
  try {
    const { name, price, category, available = true, img, nameKey } = req.body;

    const menu = await readJson(MENU_PATH);

    const newItem = {
      id: req.body.id || `M-${Date.now()}`, 
      name: name || "Menu item",
      nameKey: nameKey || null,
      price: Number(price) || 0,
      category: category || "General",
      available: typeof available === "boolean" ? available : true,
      img: img || `https://picsum.photos/400/250?menu-${menu.length + 1}`,
    };

    menu.push(newItem);
    await writeJson(MENU_PATH, menu);

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Menu POST error:", err);
    res.status(500).json({ message: "Menu save error" });
  }
});

// PUT /api/menu/:id → ürünü güncelle
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body || {};

    const menu = await readJson(MENU_PATH);
    const index = menu.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const updated = {
      ...menu[index],
      ...changes,
      price:
        changes.price !== undefined ? Number(changes.price) : menu[index].price,
    };

    menu[index] = updated;
    await writeJson(MENU_PATH, menu);

    res.json(updated);
  } catch (err) {
    console.error("Menu PUT error:", err);
    res.status(500).json({ message: "Menu update error" });
  }
});

// DELETE /api/menu/:id → ürünü sil
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await readJson(MENU_PATH);
    const newMenu = menu.filter((item) => item.id !== id);

    if (newMenu.length === menu.length) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await writeJson(MENU_PATH, newMenu);
    res.json({ id });
  } catch (err) {
    console.error("Menu DELETE error:", err);
    res.status(500).json({ message: "Menu delete error" });
  }
});

module.exports = router;
