
const Company = require("../../models/superAdmin/superAdminReg"); 
const bcrypt = require("bcryptjs");
 const generatePassword = require("../../utils/superAdmin/generatePassword");
  const transporter = require("../../config/emailConfig/emailConfig");
   const { PutObjectCommand } = require("@aws-sdk/client-s3"); 
   const r2 = require("../../config/cloudConfig/cloudConfig");
const Plan = require("../../models/plan/planModel");
const mongoose = require("mongoose");

const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      country,
      state,
      city,
      pincode,
      personName,
      personEmail,
      position,
      mob,
      companyEmail,
      companyMobile,
      planId
    } = req.body;

    // ===============================
    // ✅ Check if company already exists
    // ===============================
    const existingCompany = await Company.findOne({ companyEmail: companyEmail.trim().toLowerCase() });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company with this email already exists"
      });
    }

    // ===============================
    // ✅ Validate PlanId (ObjectId)
    // ===============================

    if (!mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Plan ID format"
      });
    }

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Plan not found"
      });
    }

    // ===============================
    // 🔹 Generate temp password
    // ===============================

    const tempPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    let certificateData = null;

    // ===============================
    // 🔹 Upload certificate to R2
    // ===============================

    if (req.file) {
      const folderName = "companyRegDetails";

      const cleanFileName =
        Date.now() + "-" +
        req.file.originalname.replace(/\s+/g, "-").toLowerCase();

      const key = `${folderName}/${cleanFileName}`;

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await r2.send(command);

      const fileUrl = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}/${key}`;

      certificateData = {
        fileName: cleanFileName,
        fileUrl
      };
    }

    // ===============================
    // 🔹 Calculate Plan Expiry
    // ===============================

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    // ===============================
    // 🔹 Save Company
    // ===============================
    // Add this to fix the login mismatch!
    const cleanCompanyEmail = companyEmail.trim().toLowerCase();

    const company = new Company({
      companyName,

      address: {
        country: typeof country === 'string' ? JSON.parse(country) : country,
        state: typeof state === 'string' ? JSON.parse(state) : state,
        city: typeof city === 'string' ? JSON.parse(city) : city,
        pincode
      },

      contactPerson: {
        personName,
        personEmail,
        position,
        mob
      },

      companyEmail: cleanCompanyEmail,
      companyMobile,

      planId: plan._id,   // 🔥 ObjectId saved
      validTill: expiryDate,

      password: hashedPassword,
      firstLogin: 0,

      certificate: certificateData
    });

    await company.save();

    // ===============================
    // ===============================

   try {
     await transporter.sendMail({
       from: `"Highline SchoolERP Support" <${process.env.EMAIL_USER}>`,
       to: companyEmail,
       subject: "Welcome to Highline SchoolERP – Your Account Credentials",
       html: `
       <div style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
         <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9;padding:30px 0;">
           <tr>
             <td align="center">
               
               <!-- Main Container -->
               <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                 
                 <!-- Header -->
                 <tr>
                   <td style="background:#0d6efd;padding:20px;text-align:center;color:#ffffff;">
                     <h2 style="margin:0;">Highline SchoolERP</h2>
                     <p style="margin:5px 0 0;font-size:14px;">Enterprise Resource Planning System</p>
                   </td>
                 </tr>
     
                 <!-- Body -->
                 <tr>
                   <td style="padding:30px;color:#333333;">
                     <p style="font-size:16px;margin-bottom:15px;">
                       Dear <strong>${companyEmail}</strong>,
                     </p>
     
                     <p style="font-size:15px;line-height:1.6;">
                       Welcome to <strong>Highline SchoolERP</strong>. 
                       Your company account has been successfully created.
                     </p>
     
                     <!-- Credentials Box -->
                     <div style="background:#f8f9fa;border-left:4px solid #0d6efd;padding:15px;margin:20px 0;border-radius:4px;">
                       <p style="margin:5px 0;"><strong>Login Email:</strong> ${companyEmail}</p>
                       <p style="margin:5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
                       <p style="margin:5px 0;"><strong>Selected Plan:</strong> ${plan.name}</p>
                       <p style="margin:5px 0;"><strong>Plan Expiry Date:</strong> ${expiryDate.toDateString()}</p>
                     </div>
     
                     <p style="font-size:14px;line-height:1.6;color:#555;">
                       For security reasons, you will be required to change your password 
                       upon your first login.
                     </p>
     
                     <p style="font-size:14px;line-height:1.6;color:#555;">
                       If you did not initiate this registration, please contact our support team immediately.
                     </p>
     
                     <p style="margin-top:25px;">
                       Best Regards,<br/>
                       <strong>Highline SchoolERP Support Team</strong>
                     </p>
                   </td>
                 </tr>
     
                 <!-- Footer -->
                 <tr>
                   <td style="background:#f1f3f6;padding:15px;text-align:center;font-size:12px;color:#777;">
                     © ${new Date().getFullYear()} Highline SchoolERP. All Rights Reserved.<br/>
                     This is an automated message. Please do not reply to this email.
                   </td>
                 </tr>
     
               </table>
               <!-- End Container -->
     
             </td>
           </tr>
         </table>
       </div>
       `
     });
   } catch (emailError) {
     await Company.findByIdAndDelete(company._id);
     throw new Error(`Email sending failed: ${emailError.message}`);
   }

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      companyId: company._id
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
const loginCompany = async (req, res) => {
  try {
    console.log('loginCompany - body:', req.body);
    let { email, password } = req.body;
    if (email && typeof email === 'string') {
      email = email.trim().toLowerCase();
    }

    const companies = await Company.find({ companyEmail: email });
    console.log('loginCompany - found companies count:', companies.length);

    if (companies.length === 0) {
      return res.status(400).json({ success: false, message: "Email not found" });
    }

    // Iterate through all found companies (handling duplicates) to find the correct password match
    let validCompany = null;
    for (const company of companies) {
      const match = await bcrypt.compare(password, company.password);
      if (match) {
        validCompany = company;
        break;
      }
    }

    if (!validCompany) {
      return res.status(400).json({ success: false, message: "Wrong password" });
    }

    // Use the validCompany for response
    if (validCompany.firstLogin === 0) {
      return res.json({ success: true, firstLogin: true, companyId: validCompany._id });
    }

    res.json({ success: true, firstLogin: false, message: "Login successful", companyId: validCompany._id });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



const updatePassword = async (req, res) => {
  try {
    const { companyId, oldPassword, newPassword } = req.body;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // If first login → skip old password check
    if (company.firstLogin !== 0) {
      const isMatch = await bcrypt.compare(oldPassword, company.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    company.password = hashedPassword;
    company.firstLogin = 1;

    await company.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
module.exports = {
  registerCompany,
  loginCompany,
  updatePassword
};