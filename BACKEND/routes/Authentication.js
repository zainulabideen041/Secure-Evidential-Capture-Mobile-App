const express = require("express");
const {
  Register,
  verifyEmailCode,
  Login,
  Logout,
  AuthMiddleware,
  createAdmin,
} = require("../controllers/Authentication");

const router = express.Router();

router.post("/create/admin", createAdmin);
router.post("/register", Register);
router.post("/verify-email", verifyEmailCode);
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/check-auth", AuthMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
