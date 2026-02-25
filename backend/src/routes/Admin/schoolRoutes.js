const express = require("express");
const router = express.Router();

const { commonLogin } = require("../../controller/commonLogin/commonLogin");
const { createTeacher } = require("../../controller/teacher/createTeacher");
const { registerStudent } = require("../../controller/student/studentController");
const { studentLogin } = require("../../controller/student/studentLoginController");
const { verifyToken } = require("../../middleware/authMiddleware/authmiddleware");
const upload = require("../../middleware/SuperAdmin/imageUpload");

// Routes
router.post("/login", commonLogin);          // Anyone logs in here
router.post("/student-login", studentLogin); // Student login route

router.post(
  "/create-teacher", 
  verifyToken, 
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "aadhaarCard", maxCount: 1 },
    { name: "qualification", maxCount: 1 },
    { name: "experience", maxCount: 1 }
  ]), 
  createTeacher
); 

router.post(
  "/register-student", 
  verifyToken, 
  upload.fields([
    { name: "studentPhoto", maxCount: 1 },
    { name: "birthCertificate", maxCount: 1 }
  ]), 
  registerStudent
); 

module.exports = router;