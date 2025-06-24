





// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Please enter your name"],
//     trim: true
//   },
//   email: {
//     type: String,
//     required: [true, "Please enter your email"],
//     trim: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: [true, "Please enter your password"],
//   },
//   role: {
//     type: String,
//     enum: ["user", "admin"],
//     default: "user"
//   },
//   joiningTime: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// const User = mongoose.model("User", userSchema);
// module.exports = User;



const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
  },
  joiningTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, { timestamps: true });

module.exports = User;

