
const mongoose = require("mongoose");
const Plan = require("./src/models/plan/planModel");
require("dotenv").config();

mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/schoolerp")
  .then(async () => {
    console.log("Connected to DB");
    
    // Check if any plan exists
    const count = await Plan.countDocuments();
    if (count === 0) {
      console.log("No plans found. Creating default plan...");
      await Plan.create({
        name: "Basic Plan",
        duration: 365,
        MonthlyPrice: 0,
        AnnualPrice: 0
      });
      console.log("Default 'Basic Plan' created.");
    } else {
      console.log("Plans already exist.");
    }

    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
