const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "in-progress", "completed"),
      defaultValue: "pending",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    category: {
      type: DataTypes.ENUM("work", "personal", "health", "school", "other"),
      defaultValue: "other",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastReminderSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isRecurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recurringType: {
      type: DataTypes.ENUM("none", "daily", "weekly", "monthly", "yearly"),
      defaultValue: "none",
    },
  },
  {
    timestamps: true,
  }
);

Task.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Task, { foreignKey: "userId" });

module.exports = Task;
