const express = require("express");
const router = express.Router();

const multer = require("multer");
const companyController = require("../../controller/superAdmin/superAdminController");
const plan=require("../../models/plan/planModel");
const planController=require("../../controller/plan/planLogic");
const { createSchool } = require("../../controller/superAdmin/schoolCreate");


// ✅ Memory storage (IMPORTANT for R2)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF or Image files allowed"), false);
    }
  },
});

router.post(
  "/register",
  upload.single("certificate"),  
  companyController.registerCompany
);


router.post("/login", companyController.loginCompany);
router.post("/update-password", companyController.updatePassword);
router.post("/create-plan", planController.createPlan);
router.post("/edit-plan", planController.editPlan);
router.get("/get-plans", planController.getPlans);
router.post("/create-school", upload.single("logo"), createSchool);

module.exports = router;