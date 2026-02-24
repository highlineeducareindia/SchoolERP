const School = require("../../models/Admin/schoolModel");
const Company = require("../../models/superAdmin/superAdminReg");
const Plan = require("../../models/plan/planModel");
const SchoolUser = require("../../models/CommonLogin/schoolUserModel"); // ✅ NAYA MODEL
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const transporter = require("../../config/emailConfig/emailConfig");

const createSchool = async (req, res) => {
  try {
    const { companyId, schoolname, email, phone, address, max_class, session_type, session, plan_id } = req.body;

    const company = await Company.findById(companyId);
    const plan = await Plan.findById(plan_id);
    if (!company || !plan) return res.status(404).json({ success: false, message: "Company or Plan not found" });

    // Check email uniqueness
    const existingUser = await SchoolUser.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });

    const schoolCount = await School.countDocuments({ companyId });
    const schoolid = "SCH-" + (schoolCount + 1).toString().padStart(3, "0");
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    // 1. Create School (No password here)
    const school = new School({
      companyId, schoolid, schoolname, email, phone, address, max_class, 
      session_type: session_type || 'Annual', session: session || null, 
      plan_id: plan._id, valid_till: expiryDate, status: "active"
    });
    await school.save();

    // 2. Generate Password & Create Admin in SchoolUser
    const tempPassword = Math.random().toString(36).slice(-8); 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const newAdminUser = new SchoolUser({
      schoolId: school._id, 
      name: schoolname, 
      email: email, 
      password: hashedPassword, 
      role: "school_admin"
    });
    await newAdminUser.save();

    // Send Email to School Admin
    await transporter.sendMail({
      from: `"Highline SchoolERP Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Highline SchoolERP – Your School Admin Credentials",
      html: `
      <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:#0d6efd;padding:20px;text-align:center;color:#ffffff;">
                    <h2 style="margin:0;">Highline SchoolERP</h2>
                    <p style="margin:5px 0 0;font-size:14px;">Enterprise Resource Planning System</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;color:#333333;">
                    <p style="font-size:16px;margin-bottom:15px;">Dear <strong>${schoolname} Admin</strong>,</p>
                    <p style="font-size:15px;line-height:1.6;">Your school account has been successfully created.</p>
                    <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:15px;margin:20px 0;border-radius:4px;">
                      <p style="margin:5px 0;"><strong>Login Email:</strong> ${email}</p>
                      <p style="margin:5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
                    </div>
                    <p style="font-size:14px;line-height:1.6;color:#555;">Please log in and change your password immediately.</p>
                    <p style="margin-top:25px;">Best Regards,<br/><strong>Highline SchoolERP Support Team</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      `
    });

    res.status(201).json({
      success: true, message: "School created successfully. Credentials sent to email."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { createSchool };