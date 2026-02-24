const SchoolUser = require("../../models/CommonLogin/schoolUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const commonLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Debug logging
    console.log("Login attempt for:", email);

    // Normalize email just in case
    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    const user = await SchoolUser.findOne({ email: normalizedEmail }).populate("schoolId");
    
    if (!user) {
        console.log("User not found for email:", normalizedEmail);
        return res.status(404).json({ success: false, message: "Invalid credentials (User not found)" });
    }

    console.log("User found:", user.email, "comparing password...");
    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials (Password mismatch)" });

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
      success: true, 
      token, 
      role: user.role, 
      id: user._id, 
      firstLogin: (user.firstLogin === 0 || user.firstLogin === undefined), // Treat undefined as first login for safety
      user: { name: user.name, email: user.email, role: user.role, schoolId: schoolData._id }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id, newPassword } = req.body;
    
    // Find user by ID
    const user = await SchoolUser.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and firstLogin status
    user.password = hashedPassword;
    user.firstLogin = 1; // Mark as not first login anymore (assuming 1 means active/updated)
    
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { commonLogin, updatePassword };