const mongoose = require("mongoose");

const screenshotSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  sha256Hash: {
    type: String,
    required: true,
  },
  md5Hash: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
  },
  linked: {
    type: Boolean,
    default: false,
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    default: null,
  },
});

module.exports = mongoose.model("Screenshot", screenshotSchema);
