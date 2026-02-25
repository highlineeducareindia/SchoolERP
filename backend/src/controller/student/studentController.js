const Student = require("../../models/student/studentModel");
const Counter = require("../../models/student/counterModel");
const bcrypt = require("bcryptjs");
const transporter = require("../../config/emailConfig/emailConfig");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("../../config/cloudConfig/cloudConfig");
const moment = require("moment");

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

    // 1. Generate Student ID (e.g., NUR-001)
    const classPrefix = className.substring(0, 3).toUpperCase(); // "Nursery" -> "NUR"
    const counterId = `${schoolId}_${classPrefix}`;
    
    const sequenceDocument = await Counter.findOneAndUpdate(
      { id: counterId },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    // Format to 3 digits (e.g., 001, 002)
    const sequenceNumber = sequenceDocument.seq.toString().padStart(3, '0');
    const generatedStudentId = `${classPrefix}-${sequenceNumber}`; // Result: NUR-001

    // 2. Generate Password from DOB (Format: DDMMYYYY)
    // Assuming dob comes as "YYYY-MM-DD" from frontend
    const dobPassword = moment(dob).format("DDMMYYYY"); 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dobPassword, salt);

    // 3. Handle Documents Upload to R2
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

    // 4. Create Student Profile (No SchoolUser creation needed)
    const newStudentProfile = new Student({
      schoolId: schoolId,
      studentId: generatedStudentId,
      password: hashedPassword,
      admissionNo: generatedStudentId, // Using generated ID as admissionNo
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

    // Send Email to Student (Optional, since they log in with ID and DOB)
    if (email) {
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
                        <p style="margin:5px 0;"><strong>Login ID (Student ID):</strong> ${generatedStudentId}</p>
                        <p style="margin:5px 0;"><strong>Password (DOB):</strong> ${dobPassword}</p>
                      </div>
                      <p style="font-size:14px;line-height:1.6;color:#555;">Please log in using your Student ID and Date of Birth (DDMMYYYY).</p>
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
    }

    res.status(201).json({
      success: true, 
      message: "Student registered successfully!",
      studentId: generatedStudentId,
      profileId: newStudentProfile._id
    });
  } catch (error) {
    console.error("Register Student Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { registerStudent };
