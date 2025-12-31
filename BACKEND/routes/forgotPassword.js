const express = require("express");
const {
  forgotPasswordCode,
  resetPasswordWithCode,
} = require("../controllers/resetPassword");

const router = express.Router();

router.post("/send-code", forgotPasswordCode);
router.post("/reset", resetPasswordWithCode);

module.exports = router;
