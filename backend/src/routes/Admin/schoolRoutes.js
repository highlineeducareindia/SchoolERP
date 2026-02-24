const express = require("express");
const router = express.Router();

const { commonLogin } = require("../../controller/commonLogin/commonLogin");
const { createTeacher } = require("../../controller/teacher/createTeacher");
const { verifyToken } = require("../../middleware/authMiddleware/authmiddleware");

// Routes
router.post("/login", commonLogin);          // Anyone logs in here
router.post("/create-teacher", verifyToken, createTeacher); // Admin creates teacher

module.exports = router;