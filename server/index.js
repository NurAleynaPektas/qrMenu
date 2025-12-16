const express = require("express");
const cors = require("cors");
const path = require("path");

const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes"); 

const { ensureTablesFile } = require("./utils/ensureTables"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// test endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Friends First API is running " });
});

// Sipariş ve menü route'ları
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

// Masalar route'u (FREE/ACTIVE görmek için)
app.use("/api/tables", tableRoutes);

// server başlarken tables.json yoksa oluştur
ensureTablesFile()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Friends First API listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error("ensureTablesFile error:", e);
    app.listen(PORT, () => {
      console.log(`Friends First API listening on http://localhost:${PORT}`);
    });
  });
