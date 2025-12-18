const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    table: { type: Number, required: true, unique: true, index: true },
    status: { type: String, enum: ["FREE", "ACTIVE"], default: "FREE" },
    activeOrderId: { type: String, default: null },
    updatedAt: { type: String, default: null }, 
  },
  { timestamps: false }
);

module.exports = mongoose.model("Table", TableSchema);
