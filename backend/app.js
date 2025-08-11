require("dotenv").config({
  path: require("path").resolve(__dirname, "./utils/.env"),
});
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");
const limiter = require("./middleware/rateLimiter");

app.use(express.json());
app.use(cors());
app.use(limiter);

const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

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
  try {
    await checkReminders();
  } catch (error) {
    console.error("❌ Error in minute-wise reminder check:", error);
  }
});
