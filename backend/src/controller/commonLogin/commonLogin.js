const SchoolUser = require("../../models/CommonLogin/schoolUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const commonLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await SchoolUser.findOne({ email }).populate("schoolId");
    if (!user) return res.status(404).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const schoolData = user.schoolId;
    if (schoolData.status !== "active" || new Date() > new Date(schoolData.valid_till)) {
      return res.status(403).json({ success: false, message: "School inactive or plan expired." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, schoolId: schoolData._id }, 
      process.env.JWT_SECRET || "fallback_secret", 
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true, token, user: { name: user.name, email: user.email, role: user.role, schoolId: schoolData._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { commonLogin };