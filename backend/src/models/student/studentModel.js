const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  // REMOVED userId reference to SchoolUser
  
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true
  },
  
  // Login Credentials
  studentId: { type: String, required: true, unique: true }, // e.g., NUR-001
  password: { type: String, required: true }, // Hashed DOB
  role: { type: String, default: 'student' },
  
  // Academic Details
  admissionNo: { type: String }, // Optional now, or you can use studentId as admissionNo
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
  email: { type: String }, // Made optional since they log in with studentId

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