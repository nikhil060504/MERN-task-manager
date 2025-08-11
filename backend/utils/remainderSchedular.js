const Task = require("../models/Task");
const sendEmail = require("./email");
const User = require("../models/User");

const checkReminders = async () => {
  const now = new Date();
  try {
    const tasks = await Task.find({
      status: { $ne: "completed" },
      reminderSent: false,
      dueDate: { $ne: null },
    }).populate("userId", "email");

    for (const task of tasks) {
      const userEmail = task.userId?.email;
      if (!userEmail) {
        continue;
      }

      let dueDateTime = new Date(task.dueDate);
      if (task.dueTime) {
        const [hours, minutes] = String(task.dueTime).split(":");
        dueDateTime.setHours(Number(hours), Number(minutes), 0, 0);
      }

      if (now >= dueDateTime) {
        const emailSent = await sendEmail(
          userEmail,
          `⏰ Reminder: Task "${task.title}" is due`,
          `Your task "${task.title}" is still pending.\n\nDescription: ${
            task.description || "No description"
          }\nDue Date: ${dueDateTime.toLocaleString()}`
        );
        if (emailSent) {
          await Task.findByIdAndUpdate(task._id, {
            reminderSent: true,
            lastReminderSentAt: now,
          });
        }
      }
    }
  } catch (error) {
    console.error("❌ Error in checkReminders:", error);
  }
};

module.exports = checkReminders;
