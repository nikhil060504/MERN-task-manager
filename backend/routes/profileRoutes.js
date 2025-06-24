const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileControllers");
const authMiddleware = require("../middleware/authMiddleware");

// Routes beginning with /api/profile
router.get("/", authMiddleware, getProfile);

module.exports = router;
