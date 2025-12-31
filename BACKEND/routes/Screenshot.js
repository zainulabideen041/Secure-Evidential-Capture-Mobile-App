const express = require("express");
const router = express.Router();
const {
  createScreenshot,
  updateScreenshot,
  getAllScreenshots,
  getScreenshotById,
  deleteScreenshot,
} = require("../controllers/Screenshot");

router.post("/create/:id", createScreenshot);
router.put("/update/:id", updateScreenshot);
router.get("/get-all/:id", getAllScreenshots);
router.get("/get/:id", getScreenshotById);
router.delete("/delete/:id", deleteScreenshot);

module.exports = router;
