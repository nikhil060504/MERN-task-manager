require("dotenv").config({ path: require('path').resolve(__dirname, './utils/.env') });
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, (err) => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  );
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});

const cron = require("node-cron");
const Task = require("./models/Task");
const sendEmail = require("./utils/email");
const checkReminders = require("./utils/remainderSchedular");

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏱️ Running minute-wise reminder check");
  try {
    await checkReminders();
  } catch (error) {
    console.error("❌ Error in minute-wise reminder check:", error);
  }
});

// Run daily at 9AM
cron.schedule("0 9 * * *", async () => {
  console.log("🔔 Running daily reminder job");
  
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    console.log(`🔍 Looking for tasks due by ${tomorrow.toLocaleString()}`);
    
    const tasks = await Task.find({
      dueDate: { $lte: tomorrow },
      dueTime: { $ne: null, $ne: "" },  // Only tasks with a specific time
      status: { $ne: "completed" },
    }).populate("user");
    
    console.log(`📋 Found ${tasks.length} upcoming tasks with due dates and times`);
    
    for (let task of tasks) {
      if (task.user?.email) {
        const dueDateTime = new Date(task.dueDate);
        if (task.dueTime) {
          const [hours, minutes] = task.dueTime.split(":");
          dueDateTime.setHours(Number(hours), Number(minutes), 0, 0);
        }
        
        console.log(`🔔 Sending upcoming reminder for task "${task.title}" to ${task.user.email}`);
        
        const emailSent = await sendEmail(
          task.user.email,
          `📅 Upcoming Task: "${task.title}" is due soon`,
          `Your task "${task.title}" is due soon.\n\nDescription: ${task.description || 'No description'}\nDue Date: ${dueDateTime.toLocaleString()}\n\nPlease complete it on time.`
        );
        
        if (emailSent) {
          console.log(`✅ Upcoming reminder email sent successfully for task "${task.title}"`);
        } else {
          console.log(`❌ Failed to send upcoming reminder email for task "${task.title}"`);
        }
      } else {
        console.log(`⚠️ Task ${task._id} has no associated user email, skipping reminder`);
      }
    }
  } catch (error) {
    console.error("❌ Error in daily reminder job:", error);
  }
});
