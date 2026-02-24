const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: String,
  address: {
    country: Object,
    state: Object,
    city: Object,
    pincode: String
  },
  contactPerson: {
    personName: String,
    personEmail: String,
    position: String,
    mob: String
  },
  companyEmail: { type: String, unique: true, required: true },
  companyMobile: String,
  
planId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Plan"
},  
activatedAt: Date,    
  validTill: Date,      
  status: { 
    type: String, 
    enum: ['active', 'expired', 'inactive'], 
    default: 'active' 
  },

  password: { type: String },
  firstLogin: { type: Number, default: 0 },
  certificate: { fileName: String, filePath: String }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);