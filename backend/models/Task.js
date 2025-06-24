const mongoose = require("mongoose");

<<<<<<< HEAD
// const taskSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     title: {
//       type: String,
//       required: true,
//     },
//     description: String,
//     status: {
//       type: String,
//       enum: ["pending", "in-progress", "completed"],
//       default: "pending",
//     },
//     priority: {
//       type: String,
//       enum: ["low", "medium", "high"],
//       default: "medium",
//     },
//     category: {
//       type: String,
//       enum: ["work", "personal", "health", "school", "other"],
//       default: "other",
//     },
//     dueDate: Date,
//     dueTime: {
//       type: String, // Store as 'HH:mm' (24-hour format)
//       default: null,
//     },
//     reminderDate: {
//       type: Date,
//       default: null,
//     },
//     completedAt: {
//       type: Date,
//     },
//     reminderSent: {
//       type: Boolean,
//       default: false,
//     },
//     lastReminderSentAt: {
//       type: Date,
//       default: null,
//     },
//     isRecurring: {
//       type: Boolean,
//       default: false,
//     },
//     recurringType: {
//       type: String,
//       enum: ["none", "daily", "weekly", "monthly", "yearly"],
//       default: "none",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Task", taskSchema);






const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Task = sequelize.define("Task", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM("pending", "in-progress", "completed"),
    defaultValue: "pending",
  },
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium",
  },
  category: {
    type: DataTypes.ENUM("work", "personal", "health", "school", "other"),
    defaultValue: "other",
  },
  dueDate: DataTypes.DATE,
  dueTime: DataTypes.STRING,
  reminderDate: DataTypes.DATE,
  completedAt: DataTypes.DATE,
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastReminderSentAt: DataTypes.DATE,
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurringType: {
    type: DataTypes.ENUM("none", "daily", "weekly", "monthly", "yearly"),
    defaultValue: "none",
  },
}, { timestamps: true });

Task.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Task, { foreignKey: "userId" });

module.exports = Task;
=======
const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["work", "personal", "health", "school", "other"],
      default: "other",
    },
    dueDate: Date,
    dueTime: {
      type: String, // Store as 'HH:mm' (24-hour format)
      default: null,
    },
    reminderDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    lastReminderSentAt: {
      type: Date,
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
