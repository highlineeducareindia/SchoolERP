  const plan = require("../../models/plan/planModel");
  
const createPlan = async (req, res) => {
  try {
    const { name, MonthlyPrice, AnnualPrice, duration, studentLimit } = req.body;
    const newPlan = new plan({ name, MonthlyPrice, AnnualPrice, duration, studentLimit });
    await newPlan.save();
    res.json({ success: true, message: "Plan created successfully", plan: newPlan });
  } catch (error) {
    console.error("CREATE PLAN ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const editPlan = async (req, res) => {
    try {
        const { planId, name, MonthlyPrice, AnnualPrice, studentLimit } = req.body;
        const updatedPlan = await plan.findByIdAndUpdate(
            planId,
            { name, MonthlyPrice, AnnualPrice, studentLimit },
            { new: true }
        );
        if (!updatedPlan) { 
            return res.status(404).json({ success: false, message: "Plan not found" });
        }
        res.json({ success: true, message: "Plan updated successfully", plan: updatedPlan });

    } catch (error) {
        console.error("EDIT PLAN ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }   
};

const getPlans = async (req, res) => {
    try {
        const plans = await plan.find();
        res.json({ success: true, plans });
    } catch (error) {
        console.error("GET PLANS ERROR:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

 
module.exports = {
  createPlan,
  editPlan,
  getPlans
};