const Student = require("../../models/student/studentModel");

const getAllStudent = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const students = await Student.find({ schoolId }).select("-password"); // Exclude password from results
    res.json({ success: true, students });
  } catch (error) {
    console.error("Get All Students Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getAllStudent };