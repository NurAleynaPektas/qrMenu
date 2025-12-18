const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, index: true }, 
    table: { type: Number, required: true, index: true },
    note: { type: String, default: "" },
    items: { type: Array, default: [] }, 
    status: {
      type: String,
      enum: ["pending", "preparing", "completed"],
      default: "pending",
    },
    createdAt: { type: String, default: null }, 
    updatedAt: { type: String, default: null },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Order", OrderSchema);
