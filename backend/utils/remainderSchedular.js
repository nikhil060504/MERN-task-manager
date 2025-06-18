const Task = require("../models/Task");
const sendEmail = require("./email");
const User = require("../models/User");

const checkReminders = async () => {
  const now = new Date();
  // Find tasks where reminder has not been sent, and the due date/time is now or past
  const tasks = await Task.find({
    status: { $ne: "completed" },
    reminderSent: false,
    dueDate: { $ne: null },
  }).populate("user", "email");

  for (const task of tasks) {
    if (!task.user?.email) continue;
    // Combine dueDate and dueTime for comparison
    let dueDateTime = new Date(task.dueDate);
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(":");
      dueDateTime.setHours(Number(hours), Number(minutes), 0, 0);
    }
    // If now is after or equal to dueDateTime, send reminder
    if (now >= dueDateTime) {
      await sendEmail(
        task.user.email,
        `⏰ Reminder: Task "${task.title}" is due`,
        `Your task "${task.title}" is still pending.\n\nDescription: ${
          task.description
        }\nDue Date: ${dueDateTime.toLocaleString()}`
      );
      task.reminderSent = true;
      task.lastReminderSentAt = now;
      await task.save();
    }
  }
};

module.exports = checkReminders;
