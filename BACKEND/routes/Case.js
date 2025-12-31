const express = require("express");
const router = express.Router();
const {
  createCase,
  getAllCases,
  getCaseById,
  deleteCase,
} = require("../controllers/Case");

router.post("/create/:userId", createCase);
router.get("/get-all/:id", getAllCases);
router.get("/get/:caseId", getCaseById);
router.delete("/delete/:id", deleteCase);

module.exports = router;
