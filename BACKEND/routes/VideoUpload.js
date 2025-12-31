const express = require("express");

const { handleVideoUpload } = require("../controllers/VideoUpload");

const router = express.Router();

router.post("/upload", handleVideoUpload);

module.exports = router;
