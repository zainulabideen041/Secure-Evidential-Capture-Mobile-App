const express = require("express");

const {
  handleImageUpload,
  deleteUploadedImage,
} = require("../controllers/ImageUpload");

const router = express.Router();

router.post("/upload", handleImageUpload);
router.delete("/delete", deleteUploadedImage);

module.exports = router;
