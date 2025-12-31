const Case = require("../models/Case");
const Screenshot = require("../models/Screenshot");

const createCase = async (req, res) => {
  try {
    const { title, description, ScreenshotId } = req.body;

    const { userId } = req.params;

    if (!userId || !title || !description || !ScreenshotId) {
      return res.status(400).json({
        success: false,
        message: "all fields are required are required",
      });
    }

    const newCase = await Case.create({
      userId,
      title,
      description,
      ScreenshotId,
    });

    // Mark screenshots as linked
    await Screenshot.updateMany(
      { _id: { $in: ScreenshotId } },
      { $set: { linked: true, caseId: newCase._id } }
    );

    res.status(201).json({ success: true, case: newCase });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllCases = async (req, res) => {
  try {
    const { id } = req.params;

    const cases = await Case.find({ userId: id })
      .populate("ScreenshotId")
      .sort({ createdAt: -1 });

    if (!cases) {
      return res.status(404).json({
        success: false,
        message: "Cases not found",
      });
    }

    res.status(200).json({ success: true, cases });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;

    const foundCase = await Case.findById(caseId).populate("ScreenshotId");

    if (!foundCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, case: foundCase });
  } catch (error) {
    console.error("Error fetching case by ID:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    const foundCase = await Case.findById({ caseId: id });

    if (!foundCase) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    // Unlink screenshots
    await Screenshot.updateMany(
      { _id: { $in: foundCase.ScreenshotId } },
      { $set: { linked: false, caseId: null } }
    );

    await Case.findByIdAndDelete(caseId);

    res
      .status(200)
      .json({ success: true, message: "Case deleted successfully" });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createCase, getAllCases, getCaseById, deleteCase };
