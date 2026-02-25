const mongoose = require("mongoose");

const schoolUserSchema = new mongoose.Schema({
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['school_admin', 'teacher'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  firstLogin: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("SchoolUser", schoolUserSchema);