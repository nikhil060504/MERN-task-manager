// const User = require("../models/User");

// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id || req.user.id).select(
//       "-password"
//     );
//     if (!user)
//       return res.status(404).json({ status: false, msg: "User not found" });
//     res
//       .status(200)
//       .json({ user, status: true, msg: "Profile found successfully.." });
//   } catch (err) {
//     console.error(err);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };






const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
<<<<<<< HEAD
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

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

=======
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
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
