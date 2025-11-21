const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MENU_FILE = path.join(__dirname, "data", "menu.json");

function loadMenu() {
  try {
    const raw = fs.readFileSync(MENU_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Menu load error:", err);
    return [];
  }
}

let menu = loadMenu();

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Friends First API is running 🚀" });
});

app.get("/api/menu", (req, res) => {
  res.json(menu);
});

app.listen(PORT, () => {
  console.log(`Friends First API listening on http://localhost:${PORT}`);
});
