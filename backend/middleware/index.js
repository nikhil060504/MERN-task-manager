



const jwt = require("jsonwebtoken");
const User = require("../models/User");




exports.verifyAccessToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ status: false, msg: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1]; // Extract actual token

  let userPayload;
  try {
    userPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.error("JWT Verification Error:", err.message); // Debugging log
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    const user = await User.findById(userPayload.id);
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "Internal Server Error" });
  }
};







