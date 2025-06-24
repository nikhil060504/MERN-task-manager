const Task = require("../models/Task"); // Sequelize model
const sendEmail = require("./email");
const { Op } = require("sequelize");
const User = require("../models/User");

const checkReminders = async () => {
  const now = new Date();
  const tasks = await Task.findAll({
    where: {
      status: { [Op.ne]: "completed" },
      reminderSent: false,
      dueDate: { [Op.ne]: null },
    },
    include: [
      {
        model: User,
        attributes: ["email"],
      },
    ],
  });
  for (const task of tasks) {
    if (!task.User?.email) continue;
    let dueDateTime = new Date(task.dueDate);
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(":");
      dueDateTime.setHours(Number(hours), Number(minutes), 0, 0);
    }
    if (now >= dueDateTime) {
      await sendEmail(
        task.User.email,
        `⏰ Reminder: Task "${task.title}" is due`,
        `Your task "${task.title}" is still pending.\n\nDescription: ${
          task.description
        }\nDue Date: ${dueDateTime.toLocaleString()}`
      );
      await task.update({ reminderSent: true, lastReminderSentAt: now });
    }
  }
};

module.exports = checkReminders;
