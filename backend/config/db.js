const mongoose = require("mongoose");
require("dotenv").config();

console.log("DATABASE ENV CHECK:", {
  MONGODB_URL: process.env.MONGODB_URL ? "Set" : "Not Set",
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
