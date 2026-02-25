const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // e.g., "schoolId_NUR"
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model("Counter", counterSchema);