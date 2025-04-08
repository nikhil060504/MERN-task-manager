// const User = require("../models/User");
// const bcrypt = require("bcrypt");
// const { createAccessToken } = require("../utils/token");
// const { validateEmail } = require("../utils/validation");


// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ msg: "Please fill all the fields" });
//     }
//     if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
//       return res.status(400).json({ msg: "Please send string values only" });
//     }


//     if (password.length < 4) {
//       return res.status(400).json({ msg: "Password length must be atleast 4 characters" });
//     }

//     if (!validateEmail(email)) {
//       return res.status(400).json({ msg: "Invalid Email" });
//     }

//     const user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "This email is already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({ name, email, password: hashedPassword });
//     res.status(200).json({ msg: "Congratulations!! Account has been created for you.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// }



// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ status: false, msg: "Please enter all details!!" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ status: false, msg: "This email is not registered!!" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ status: false, msg: "Password incorrect!!" });

//     const token = createAccessToken({ id: user._id });
//     delete user.password;
//     res.status(200).json({ token, user, status: true, msg: "Login successful.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }






const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    console.log("📩 Signup route hit:", req.body);
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

