const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("[SIGNUP ERROR]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.warn(
        "[LOGIN] ACCESS_TOKEN_SECRET is not set in environment variables!"
      );
      return res
        .status(500)
        .json({ message: "Server misconfiguration: missing token secret" });
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const { password: _, ...userData } = user.toJSON();
    res.status(200).json({ token, user: userData });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
