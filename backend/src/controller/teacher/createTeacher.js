const SchoolUser = require("../../models/CommonLogin/schoolUserModel");
const bcrypt = require("bcryptjs");
const transporter = require("../../config/emailConfig/emailConfig");

const createTeacher = async (req, res) => {
  try {
    const schoolId = req.user.schoolId; // Comes from Middleware
    const { name, email } = req.body;

    const existingUser = await SchoolUser.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email exists" });

    const tempPassword = Math.random().toString(36).slice(-8); 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    const newTeacher = new SchoolUser({
      schoolId: schoolId, name, email, password: hashedPassword, role: "teacher"
    });
    await newTeacher.save();

    // Send Email to Teacher
    await transporter.sendMail({
      from: `"Highline SchoolERP Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Highline SchoolERP – Your Teacher Credentials",
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
                    <p style="font-size:16px;margin-bottom:15px;">Dear <strong>${name}</strong>,</p>
                    <p style="font-size:15px;line-height:1.6;">Your teacher account has been successfully created.</p>
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
      success: true, message: "Teacher created successfully. Credentials sent to email."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { createTeacher };