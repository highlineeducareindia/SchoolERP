const mongoose = require("mongoose");
const planSchema = new mongoose.Schema({
 name:{
    type:String,
    required:true
 },
 MonthlyPrice:{
    type:Number,
    required:true
    },
    AnnualPrice:{
        type:Number,
        required:true
    },
    studentLimit: {
        type: Number,
        required: false,
        default: 0
    },
    // duration in days
        duration: {
            type: Number,
            required: true,
            default: 365
        }

});
module.exports = mongoose.model("Plan",planSchema);