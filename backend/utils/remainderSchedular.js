const Task = require('../models/Task');
const sendEmail = require('./email');
const User = require('../models/User');

const checkReminders = async () => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const oneMinuteAhead = new Date(now.getTime() + 1 * 60 * 1000);

  const tasks = await Task.find({
    dueDate: { $lte: oneMinuteAhead }, // buffer ahead
    status: { $ne: "completed" },
    $or: [
      { lastReminderSentAt: null },
      { lastReminderSentAt: { $lte: fiveMinutesAgo } }
    ]
  }).populate("user", "email");

  console.log("🔎 Reminder Check Time:", now.toISOString());
  console.log("🔔 Tasks to remind:", tasks.length);

  for (const task of tasks) {
    if (!task.user?.email) continue;

    await sendEmail(
      task.user.email,
      `⏰ Reminder: Task "${task.title}" is due`,
      `Your task "${task.title}" is still pending.\n\nDescription: ${task.description}\nDue Date: ${new Date(task.dueDate).toLocaleString()}`
    );

    task.lastReminderSentAt = now;
    await task.save();
  }
};

module.exports = checkReminders;
