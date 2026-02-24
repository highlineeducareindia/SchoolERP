const mongoose = require("mongoose");

const teacherProfileSchema = new mongoose.Schema({
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
  
  // Basic Details
  employeeId: { type: String, unique: true, sparse: true },
  aadhaar: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Other'] },

  // Professional Details
  designation: { type: String },
  specialization: { type: String },
  joiningDate: { type: Date }, // Should be Date
  employmentType: { type: String, enum: ['Full Time', 'Part Time', 'Contract'] },
  experienceYears: { type: Number },

  // Educational Details
  qualification: { type: String },
  university: { type: String },
  passingYear: { type: Number },

  // Contact & Residential Details
  address: {
    fullAddress: String,
    city: String,
    state: String,
    country: String,
    pincode: String
  },
  
  // Salary
  salary: { type: Number },

  // Bank Details
  bankDetails: {
    accountHolder: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String
  },
  
  // Documents (URLs or paths)
  documents: {
    profilePhoto: String,
    aadhaarCard: String,
    qualificationProof: String,
    experienceProof: String
  }

}, { timestamps: true });

module.exports = mongoose.model("TeacherProfile", teacherProfileSchema);
