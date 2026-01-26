const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: { type: String, default: "staff" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }, 
);

module.exports = mongoose.model("Staff", staffSchema);
