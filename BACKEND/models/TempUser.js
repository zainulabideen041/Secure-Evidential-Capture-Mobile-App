const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email_status: {
    type: String,
    enum: ["verified", "notverified"],
    default: "notverified",
  },
  account_status: {
    type: String,
    enum: ["verified", "notverified"],
    default: "notverified",
  },
  identity: {
    type: String,
    required: true,
    trim: true, // e.g., "Lawyer", "Journalist", "Police Officer"
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true, // e.g., "Investigator at XYZ", "Cybercrime Analyst"
  },
  usagePurpose: {
    type: String,
    required: true,
    trim: true, // e.g., "To collect evidence in cyberbullying cases"
  },
  code: {
    type: String,
    required: true,
  },
  codeExpires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TempUser", tempUserSchema);
