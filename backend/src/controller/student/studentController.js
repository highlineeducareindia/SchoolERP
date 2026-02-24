const SchoolUser = require("../../models/CommonLogin/schoolUserModel");
const Student = require("../../models/Admin/studentModel");
const bcrypt = require("bcryptjs");
const transporter = require("../../config/emailConfig/emailConfig");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../../config/cloudConfig/cloudConfig");

const registerStudent = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const { 
      admissionNo, class: className, section, admissionDate,
      fullName, dob, gender, bloodGroup, aadhar,
      fatherName, motherName, phone, email,
      transportRequired
    } = req.body;

    // Parse Address (FormData sends it as string)
    let parsedAddress = {};
    try {
      parsedAddress = req.body.address ? JSON.parse(req.body.address) : {};
    } catch (error) {
      console.error("Address parsing error:", error);
      parsedAddress = {}; 
    }

    // Validation
    const errors = [];
    if (!admissionNo) errors.push("Admission Number is required");
    if (!className) errors.push("Class is required");
    if (!section) errors.push("Section is required");
    if (!admissionDate) errors.push("Admission Date is required");
    if (!fullName) errors.push("Full Name is required");
    if (!dob) errors.push("Date of Birth is required");
    if (!gender) errors.push("Gender is required");
    if (!fatherName) errors.push("Father's Name is required");
    if (!motherName) errors.push("Mother's Name is required");
    if (!phone) errors.push("Phone Number is required");
    if (!email) errors.push("Email is required");
    if (!parsedAddress.fullAddress) errors.push("Full Address is required");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation Failed", errors });
    }

    // Check if email already exists
    const existingUser = await SchoolUser.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already exists" });

    // Generate credentials
    const tempPassword = Math.random().toString(36).slice(-8); 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 1. Create User (Login Access)
    const newStudentUser = new SchoolUser({
      schoolId: schoolId, 
      name: fullName, 
      email, 
      phone,
      password: hashedPassword, 
      role: "student"
    });
    await newStudentUser.save();

    // Handle Documents Upload to R2
    const uploadedDocs = {};
    if (req.files) {
      for (const key in req.files) {
        const file = req.files[key][0];
        const folderName = "studentDocuments";
        const cleanFileName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-").toLowerCase();
        const s3Key = `${folderName}/${cleanFileName}`;

        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        });

        await r2.send(command);
        uploadedDocs[key] = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${s3Key}`;
      }
    }

    // 2. Create Profile (Detailed Info)
    const newStudentProfile = new Student({
      userId: newStudentUser._id,
      schoolId: schoolId,
      admissionNo,
      class: className,
      section,
      admissionDate,
      fullName,
      dob,
      gender,
      bloodGroup,
      aadhar,
      fatherName,
      motherName,
      phone,
      email,
      address: parsedAddress,
      documents: {
        studentPhoto: uploadedDocs.studentPhoto || "",
        birthCertificate: uploadedDocs.birthCertificate || ""
      },
      transportRequired: transportRequired === 'Yes' || transportRequired === true
    });
    
    await newStudentProfile.save();

    // Send Email to Student
    await transporter.sendMail({
      from: `"Highline SchoolERP Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Highline SchoolERP – Your Student Credentials",
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
                    <p style="font-size:16px;margin-bottom:15px;">Dear <strong>${fullName}</strong>,</p>
                    <p style="font-size:15px;line-height:1.6;">Your student account has been successfully created.</p>
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
      success: true, 
      message: "Student registered successfully!",
      userId: newStudentUser._id,
      profileId: newStudentProfile._id
    });
  } catch (error) {
    console.error("Register Student Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerStudent };
