const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const TempUser = require("../models/TempUser");
const SendEmail = require("../utils/sendEmail");

// CREATE ADMIN CONTROLLER
const createAdmin = async (req, res) => {
  const { name, email, password, identity, jobTitle, usagePurpose } = req.body;

  try {
    // Validate input
    if (
      !email ||
      !password ||
      !name ||
      !identity ||
      !jobTitle ||
      !usagePurpose
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user directly in main User collection
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      identity,
      jobTitle,
      usagePurpose,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the admin",
    });
  }
};

// REGISTER TEMP USER CONTROLLER
const Register = async (req, res) => {
  const { name, email, password, identity, jobTitle, usagePurpose } = req.body;

  try {
    // Validate email or phone presence
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required for registration",
      });
    }

    // Check for existing user in main user collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or phone",
      });
    }

    // Remove existing unverified temp user (cleanup)
    await TempUser.deleteOne({ email });

    // Generate code and hash password
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new temp user
    const tempUser = new TempUser({
      name,
      email,
      password: hashedPassword,
      identity,
      jobTitle,
      usagePurpose,
      code: verificationCode,
      codeExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    await tempUser.save();

    // Send email with the verification code
    await SendEmail(email, "Verify Your Email", "verify", verificationCode);

    res.status(200).json({
      success: true,
      message:
        "Verification code sent to your email. Please verify to complete registration.",
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "A verification attempt already exists. Please check your email or try again shortly.",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred during registration",
    });
  }
};

// REGISTER USER CONTROLLER
const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email });

    if (
      !tempUser ||
      tempUser.code !== code ||
      tempUser.codeExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    tempUser.email_status = "verified";
    await tempUser.save();

    res.status(200).json({
      success: true,
      message: "Email verified, Please wait for Admin Approval.",
      tempUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during verification",
    });
  }
};

// LOGIN USER CONTROLLER
const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists in approved users
    const user = await User.findOne({ email });

    if (!user) {
      // Check if pending user exists
      const tempUser = await TempUser.findOne({ email });

      if (tempUser) {
        if (tempUser.account_status === "notverified") {
          return res.status(401).json({
            success: false,
            message:
              "Your Account is Pending For Admin Approval. Please Try Again Later.",
          });
        }
      }

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return res.status(503).json({
        message: "Database connection timeout. Please try again shortly.",
        error: "CONNECTION_TIMEOUT",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in",
    });
  }
};

// LOGOUT USER CONTROLLER
const Logout = async (req, res) => {
  try {
    res.json({ success: true, message: "Logged out Successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};

// AUTH CHECK MIDDLEWARE
const AuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token)
    return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded_user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded_user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Unauthorized User" });
  }
};

module.exports = {
  Register,
  verifyEmailCode,
  Logout,
  Login,
  AuthMiddleware,
  createAdmin,
};
