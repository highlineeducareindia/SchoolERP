const Teacher = require("../../models/Admin/teacherModel");

const getAllTeacher = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const teachers = await Teacher.find({ schoolId }).select("-password"); // Exclude password from results
    res.json({ success: true, teachers });
  } catch (error) {
    console.error("Get All Teachers Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllTeacher };