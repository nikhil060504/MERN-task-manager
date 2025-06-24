require("dotenv").config();
const express = require("express");
const app = express();
// const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors());

<<<<<<< HEAD
// const mongoUrl = process.env.MONGODB_URL;
// mongoose.connect(mongoUrl, (err) => {
//   if (err) throw err;
//   console.log("Mongodb connected...");
// });

const sequelize = require("./config/db");

sequelize.sync({ alter: true }) // creates or alters tables
  .then(() => console.log("✅ MySQL Database Synced"))
  .catch((err) => console.error("❌ Sync Error:", err));

=======
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, (err) => {
  if (err) throw err;
  console.log("Mongodb connected...");
});
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d

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
const { sendReminderEmail } = require("./utils/email");
const checkReminders = require("./utils/remainderSchedular");

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏱️ Running minute-wise reminder check");
  await checkReminders();
});

// Run daily at 9AM
cron.schedule("0 9 * * *", async () => {
  console.log("🔔 Running daily reminder job");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({
    dueDate: { $lte: tomorrow },
    status: { $ne: "completed" },
  }).populate("user");

  for (let task of tasks) {
    if (task.user.email) {
      await sendReminderEmail(task.user.email, task);
    }
  }
});
