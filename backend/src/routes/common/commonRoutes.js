const express = require("express");
const router = express.Router();
const { commonLogin, updatePassword } = require("../../controller/commonLogin/commonLogin");

router.post("/login", commonLogin);
router.post("/update-password", updatePassword);

module.exports = router;