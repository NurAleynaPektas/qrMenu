const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const tableRoutes = require("./routes/tableRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// test endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Friends First API is running " });
});

app.use("/api/orders", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);

async function start() {
  try {
    if (!process.env.MONGO_URI) {
      console.warn(" MONGO_URI yok. .env içine eklemen lazım.");
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(" MongoDB connected");
    }
  } catch (e) {
    console.error("MongoDB connect error:", e.message);
  }

  app.listen(PORT, () => {
    console.log(`Friends First API listening on http://localhost:${PORT}`);
  });
}

start();
