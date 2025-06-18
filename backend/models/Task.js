const mongoose = require("mongoose");

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
