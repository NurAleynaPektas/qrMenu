const express = require("express");
const cors = require("cors");

const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// test endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Friends First API is running 🚀" });
});

// Sipariş ve menü route'ları
app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);

app.listen(PORT, () => {
  console.log(`Friends First API listening on http://localhost:${PORT}`);
});
