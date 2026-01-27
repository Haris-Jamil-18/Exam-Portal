const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  userSignup,
  userLogin,
  adminLogin,
  adminSignup,
  getMe,
  logout,
} = require("../controller/authController");

// User routes
router.post("/signup", userSignup);
router.post("/login", userLogin);

// Admin routes
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);

// Protected routes
router.get("/me", protect, getMe);
router.get("/logout", logout);

module.exports = router;
