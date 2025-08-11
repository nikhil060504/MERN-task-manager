const Task = require("../models/Task");
const sendEmail = require("./email");
const User = require("../models/User");

const checkReminders = async () => {
  const now = new Date();
  console.log(`🔍 Checking reminders at ${now.toLocaleString()}`);
  
  try {
    // Find tasks where reminder has not been sent, and the due date/time is now or past
    const tasks = await Task.find({
      status: { $ne: "completed" },
      reminderSent: false,
      dueDate: { $ne: null },
      dueTime: { $ne: null, $ne: "" },  // Only tasks with a specific time
    }).populate("user", "email");
    
    // Force a test reminder if no tasks are found
    if (tasks.length === 0) {
      console.log("📋 No pending tasks found, creating a test reminder");
      
      // Send a test email
      await sendEmail(
        "patidarnikhil314@gmail.com",
        "🧪 Test Reminder Email",
        `This is a test reminder email sent at ${now.toLocaleString()}\n\nIf you're receiving this, the email system is working correctly.`
      );
      
      return;
    }
  
  console.log(`📋 Found ${tasks.length} pending tasks with due dates and times that need reminders`);

  for (const task of tasks) {
    if (!task.user?.email) {
      console.log(`⚠️ Task ${task._id} has no associated user email, skipping reminder`);
      continue;
    }
    
    // Combine dueDate and dueTime for comparison
    let dueDateTime = new Date(task.dueDate);
    if (task.dueTime) {
      const [hours, minutes] = task.dueTime.split(":");
      dueDateTime.setHours(Number(hours), Number(minutes), 0, 0);
    }
    
    console.log(`📅 Task "${task.title}" (ID: ${task._id}):\n  - Due: ${dueDateTime.toLocaleString()}\n  - Current time: ${now.toLocaleString()}\n  - Is due: ${now >= dueDateTime ? 'YES' : 'NO'}`);
    
    // If now is after or equal to dueDateTime, send reminder
    if (now >= dueDateTime) {
      console.log(`🔔 Sending reminder for task "${task.title}" to ${task.user.email}`);
      
      const emailSent = await sendEmail(
        task.user.email,
        `⏰ Reminder: Task "${task.title}" is due`,
        `Your task "${task.title}" is still pending.\n\nDescription: ${
          task.description || 'No description'
        }\nDue Date: ${dueDateTime.toLocaleString()}`
      );
      
      if (emailSent) {
        console.log(`✅ Reminder email sent successfully for task "${task.title}"`);
        task.reminderSent = true;
        task.lastReminderSentAt = now;
        await task.save();
        console.log(`✅ Task "${task.title}" updated with reminderSent=true`);
      } else {
        console.log(`❌ Failed to send reminder email for task "${task.title}"`);
      }
    }
  }
  } catch (error) {
    console.error("❌ Error in checkReminders:", error);
  }
};

module.exports = checkReminders;
