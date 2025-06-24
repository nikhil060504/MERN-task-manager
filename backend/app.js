require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors());

const sequelize = require("./config/db");

sequelize
  .sync({ alter: true }) // creates or alters tables
  .then(() => console.log("✅ MySQL Database Synced"))
  .catch((err) => console.error("❌ Sync Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
  );
}

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Backend is running on port ${port}`);
});

const cron = require("node-cron");
const checkReminders = require("./utils/remainderSchedular");

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("⏱️ Running minute-wise reminder check");
  await checkReminders();
});
