const { Op } = require("sequelize");
const Task = require("../models/Task");
const User = require("../models/User");
const sendEmail = require("../utils/email");

// ✅ CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      dueDate,
      dueTime,
      category,
      priority,
      isRecurring,
      recurringType,
    } = req.body;

    const task = await Task.create({
      userId: req.user.id,
      title,
      description,
      status,
      dueDate,
      dueTime,
      category,
      priority,
      isRecurring,
      recurringType,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ GET TASKS (with filtering, pagination, search)
exports.getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      category,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows: tasks, count: total } = await Task.findAndCountAll({
      where: filter,
      order: [[sortBy, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET TASK BY ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res
      .status(200)
      .json({ task, status: true, msg: "Task found successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      console.log("[updateTask] Task not found or access denied", {
        id: req.params.id,
        userId: req.user.id,
      });
      return res
        .status(404)
        .json({ message: "Task not found or access denied" });
    }

    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "category",
      "dueDate",
      "dueTime",
      "reminderDate",
      "isRecurring",
      "completedAt",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // Debug: log status and completedAt logic
    if (updates.status === "completed" && task.status !== "completed") {
      updates.completedAt = new Date();
<<<<<<< HEAD
      
      // Send email notification when task is completed
      try {
        const sendEmail = require('../utils/email');
        // Force email to patidarnikhil314@gmail.com for testing
        const userEmail = "patidarnikhil314@gmail.com";
        console.log(`🎯 Sending completion email to ${userEmail} (original user: ${req.user.email}) for task ${task._id}`);
        
        const emailSubject = "✅ Task Completed Successfully";
        const emailText = `Congratulations! Your task "${task.title}" has been marked as completed.\n\nTask Details:\nTitle: ${task.title}\nDescription: ${task.description || 'No description'}\nCompleted on: ${new Date().toLocaleString()}\n\nThank you for using our Task Manager!`;
        
        const emailSent = await sendEmail(userEmail, emailSubject, emailText);
        if (emailSent) {
          console.log(`✅ Completion email sent successfully to ${userEmail} for task ${task._id}`);
        } else {
          console.log(`❌ Failed to send completion email to ${userEmail} for task ${task._id}`);
        }
      } catch (emailError) {
        console.error("❌ Failed to send completion email:", emailError);
        // Continue with task update even if email fails
      }
=======
      console.log("[updateTask] Setting completedAt:", updates.completedAt);
>>>>>>> 28528e26eaf52a94566981316940f0b41dcfe06f
    } else if (updates.status && updates.status !== "completed") {
      updates.completedAt = null;
      console.log("[updateTask] Clearing completedAt");
    }

    await task.update(updates);
    console.log("[updateTask] Task updated:", task.toJSON());
    res.status(200).json({ status: true, msg: "Task updated", task });
  } catch (error) {
    console.error("[updateTask] Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    // Use Sequelize: find by id and userId
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.destroy();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ SEND REMINDERS
exports.sendReminders = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.findAll({
      where: {
        dueDate: { [Op.lte]: tomorrow },
        status: { [Op.ne]: "completed" },
        reminderSent: false,
      },
      include: {
        model: User,
        attributes: ["email"],
      },
    });

    let sentCount = 0;
    for (const task of tasks) {
      if (!task.User?.email) continue;
      const message = `Reminder: Your task "${task.title}" is due soon.\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}`;
      await sendEmail(task.User.email, "Task Reminder", message);
      await task.update({ reminderSent: true });
      sentCount++;
    }

    res.status(200).json({ message: `${sentCount} reminder(s) sent.` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Reminder sending failed", error: error.message });
  }
};

// ✅ TASK STATS
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const [total, completed, inProgress, pending, recurring] =
      await Promise.all([
        Task.count({ where: { userId } }),
        Task.count({ where: { userId, status: "completed" } }),
        Task.count({ where: { userId, status: "in-progress" } }),
        Task.count({ where: { userId, status: "pending" } }),
        Task.count({ where: { userId, isRecurring: true } }),
      ]);
    res.json({ total, completed, inProgress, pending, recurring });
  } catch (error) {
    res.status(500).json({ message: "Stats error", error: error.message });
  }
};

// ✅ COMPLETION GRAPH (last 7 days)
exports.getTaskCompletionGraph = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.findAll({
      where: {
        userId,
        status: "completed",
        completedAt: { [Op.ne]: null },
      },
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(day.getDate() - (6 - i));
      return day;
    });
    const graphData = last7Days.map((date) => {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayStart.getDate() + 1);
      const completedCount = tasks.filter((task) => {
        const completed = new Date(task.completedAt);
        return completed >= dayStart && completed < dayEnd;
      }).length;
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        completed: completedCount,
        isToday: today.toDateString() === date.toDateString(),
      };
    });
    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ message: "Graph error", error: error.message });
  }
};

// ✅ CALENDAR EVENTS (user tasks with due dates)
exports.getCalenderEvents = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      attributes: ["id", "title", "description", "dueDate", "status"],
      order: [["dueDate", "ASC"]],
    });
    const events = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      start: task.dueDate,
      status: task.status,
    }));
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Calendar error", error: error.message });
  }
};

// ✅ BULK CREATE TASKS
exports.bulkCreateTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks provided" });
    }
    const userId = req.user.id;
    const formattedTasks = tasks.map((task) => ({ ...task, userId }));
    const created = await Task.bulkCreate(formattedTasks);
    res
      .status(201)
      .json({ message: "Tasks created successfully", tasks: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
