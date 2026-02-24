const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Company", 
    required: true 
  },

  schoolid: { type: String, required: true, unique: true },
  schoolname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  address: { 
    BuildingNo: String,
    BuildingName: String,
    locality: String,
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },

  max_class: { type: Number, default: 12 },

  session_type: { 
    type: String, 
    enum: ['Annual', 'Semester'], 
    default: 'Annual' 
  },

  // raw session string (e.g. "2025-26")
  session: {
    type: String
  },

  // 🔥 PLAN REFERENCE
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true
  },

  valid_till: Date,

  status: { 
    type: String, 
    enum: ["active", "expired", "suspended"],
    default: 'active' 
  },
 


}, { timestamps: true });

module.exports = mongoose.model("School", schoolSchema);