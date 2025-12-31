const Screenshot = require("../models/Screenshot");
const { DeleteImage } = require("../utils/cloudinary");

// CREATE Screenshot
const createScreenshot = async (req, res) => {
  try {
    const { url, cloudinaryId, sha256Hash, md5Hash, notes } = req.body;
    const { id } = req.params;

    if (!url || !cloudinaryId || !sha256Hash || !md5Hash) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const screenshot = new Screenshot({
      userId: id,
      url,
      cloudinaryId,
      sha256Hash,
      md5Hash,
      notes,
    });

    await screenshot.save();
    res.status(201).json({ message: "Screenshot created", screenshot });
  } catch (error) {
    console.error("Create Screenshot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all screenshots of the logged-in user
const getAllScreenshots = async (req, res) => {
  const { id } = req.params;
  try {
    const screenshots = await Screenshot.find({ userId: id }).sort({
      timestamp: -1,
    });
    res.status(200).json({ screenshots });
  } catch (error) {
    console.error("Get All Screenshots Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET a specific screenshot by ID
const getScreenshotById = async (req, res) => {
  try {
    const { id } = req.params;

    const screenshot = await Screenshot.findById(id);

    if (!screenshot) {
      return res.status(404).json({ message: "Screenshot not found" });
    }

    res.status(200).json({ screenshot });
  } catch (error) {
    console.error("Get Screenshot By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Screenshot (linked + caseId only)
const updateScreenshot = async (req, res) => {
  try {
    const { id } = req.params;
    const { linked, caseId } = req.body;

    const screenshot = await Screenshot.findById(id);
    if (!screenshot) {
      return res.status(404).json({ message: "Screenshot not found" });
    }

    if (typeof linked !== "undefined") screenshot.linked = linked;
    if (typeof caseId !== "undefined") screenshot.caseId = caseId;

    await screenshot.save();
    res.status(200).json({ message: "Screenshot updated", screenshot });
  } catch (error) {
    console.error("Update Screenshot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE Screenshot
const deleteScreenshot = async (req, res) => {
  try {
    const { id } = req.params;

    const screenshot = await Screenshot.findById(id);
    if (!screenshot) {
      return res.status(404).json({ message: "Screenshot not found" });
    }

    await DeleteImage(screenshot.cloudinaryId);
    await screenshot.deleteOne();

    res.status(200).json({ message: "Screenshot deleted" });
  } catch (error) {
    console.error("Delete Screenshot Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createScreenshot,
  updateScreenshot,
  deleteScreenshot,
  getAllScreenshots,
  getScreenshotById,
};
