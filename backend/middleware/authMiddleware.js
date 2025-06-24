// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const authMiddleware = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith("Bearer "))
//     return res.status(401).json({ msg: "No token" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const user = await User.findById(decoded.id || decoded._id);
//     if (!user) return res.status(401).json({ msg: "User not found" });
//     req.user = user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;

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

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log("[authMiddleware] Decoded token:", decoded);

      const userId = decoded.id || decoded._id;
      if (!userId) {
        console.log("[authMiddleware] No user ID in token");
        return res.status(401).json({ msg: "Invalid token content" });
      }

<<<<<<< HEAD
      const user = await User.findByPk(userId);
=======
      const user = await User.findById(userId);
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
      if (!user) {
        console.log("[authMiddleware] User not found:", userId);
        return res.status(401).json({ msg: "User not found" });
      }

      // Attach user to request
      req.user = user;
      console.log(
        "[authMiddleware] Authentication successful for user:",
<<<<<<< HEAD
        user.id // Sequelize uses 'id', not '_id'
=======
        user._id
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
      );
      next();
    } catch (jwtError) {
      console.error("[authMiddleware] JWT verification failed:", jwtError);
      return res.status(401).json({ msg: "Invalid token" });
    }
  } catch (error) {
    console.error("[authMiddleware] Unexpected error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = authMiddleware;
