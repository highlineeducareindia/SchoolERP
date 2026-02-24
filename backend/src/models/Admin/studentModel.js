const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "SchoolUser", 
    required: true, 
    unique: true 
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
  },
  
  // Academic Details
  admissionNo: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  admissionDate: { type: Date, required: true },

  // Personal Information
  fullName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  bloodGroup: { type: String },
  aadhar: { type: String },

  // Parent / Guardian
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },

  // Residential Address
  address: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String
  },

  // Documents (URLs or paths)
  documents: {
    studentPhoto: String,
    birthCertificate: String
  },

  // Transport
  transportRequired: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
