const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifyAccessToken = async (req, res, next) => {
  console.log("[verifyAccessToken] Incoming headers:", req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id || decoded._id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};
