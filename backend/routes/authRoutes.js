const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authControllers");
const rateLimiter = require('../middleware/rateLimiter');

// Routes beginning with /api/auth
console.log("✅ Auth routes loaded");

router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);

module.exports = router;
