const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select(
      "-password"
    );
    if (!user)
      return res.status(404).json({ status: false, msg: "User not found" });
    res
      .status(200)
      .json({ user, status: true, msg: "Profile found successfully.." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
