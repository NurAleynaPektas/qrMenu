const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true }, // senin M-... id'in
    name: { type: String, default: "Menu item" },
    nameKey: { type: String, default: null },
    price: { type: Number, default: 0 },
    category: { type: String, default: "General" },
    available: { type: Boolean, default: true },
    img: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", MenuSchema);
