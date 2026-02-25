const Student = require("../../models/student/studentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    // 1. Find student by ID
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2. Verify password (DOB)
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: student._id, schoolId: student.schoolId, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: "student",
      studentData: {
        id: student._id,
        name: student.fullName,
        studentId: student.studentId,
        class: student.class
      }
    });

  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { studentLogin };