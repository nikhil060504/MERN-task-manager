const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Log request info for debugging
    console.log("[authMiddleware] Request:", {
      method: req.method,
      path: req.path,
      headers: req.headers,
    });

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("[authMiddleware] No Bearer token found");
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("[authMiddleware] Token is empty");
      return res.status(401).json({ msg: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("[authMiddleware] Decoded token:", decoded);

    const userId = decoded.id || decoded._id;
    if (!userId) {
      console.log("[authMiddleware] No user ID in token");
      return res.status(401).json({ msg: "Invalid token content" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("[authMiddleware] User not found");
      return res.status(401).json({ msg: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("[authMiddleware] Error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;
