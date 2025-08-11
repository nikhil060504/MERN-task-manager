const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }
    res.status(200).json({
      user,
      status: true,
      msg: "Profile found successfully",
    });
  } catch (err) {
    console.error("[GET PROFILE ERROR]", err);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};
