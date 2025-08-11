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
      userId: req.user._id || req.user.id,
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

// ✅ GET TASKS (with filtering, pagination, search, and date filtering)
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
      dateFilter,
      startDate,
      endDate,
      day,
      month,
      year,
    } = req.query;

    const filter = { userId: req.user._id || req.user.id };

    // Status, priority, category filters
    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (category && category !== "all") filter.category = category;

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Date filtering logic
    if (dateFilter || startDate || endDate || day || month || year) {
      filter.dueDate = {};

      if (dateFilter === "today") {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        filter.dueDate = { $gte: startOfDay, $lte: endOfDay };
      } else if (dateFilter === "week") {
        const today = new Date();
        const startOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        filter.dueDate = { $gte: startOfWeek, $lte: endOfWeek };
      } else if (dateFilter === "month") {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        filter.dueDate = { $gte: startOfMonth, $lte: endOfMonth };
      } else if (startDate && endDate) {
        filter.dueDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        };
      } else if (startDate) {
        filter.dueDate = { $gte: new Date(startDate) };
      } else if (endDate) {
        filter.dueDate = { $lte: new Date(endDate + "T23:59:59.999Z") };
      }

      // Specific day, month, year filtering
      if (day || month || year) {
        const dateQuery = {};
        if (year)
          dateQuery.$expr = {
            ...(dateQuery.$expr || {}),
            $eq: [{ $year: "$dueDate" }, parseInt(year)],
          };
        if (month)
          dateQuery.$expr = {
            ...(dateQuery.$expr || {}),
            $eq: [{ $month: "$dueDate" }, parseInt(month)],
          };
        if (day)
          dateQuery.$expr = {
            ...(dateQuery.$expr || {}),
            $eq: [{ $dayOfMonth: "$dueDate" }, parseInt(day)],
          };

        // Merge with existing date filter
        if (Object.keys(filter.dueDate).length > 0) {
          filter.$and = [{ dueDate: filter.dueDate }, dateQuery];
          delete filter.dueDate;
        } else {
          Object.assign(filter, dateQuery);
        }
      }
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate("userId", "name email");

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      tasks,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[getTasks] Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET TASK BY ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id || req.user.id,
    }).populate("userId", "name email");

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
      _id: req.params.id,
      userId: req.user._id || req.user.id,
    });

    if (!task) {
      console.log("[updateTask] Task not found or access denied", {
        id: req.params.id,
        userId: req.user._id || req.user.id,
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
      console.log("[updateTask] Setting completedAt:", updates.completedAt);
    } else if (updates.status && updates.status !== "completed") {
      updates.completedAt = null;
      console.log("[updateTask] Clearing completedAt");
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("userId", "name email");

    console.log("[updateTask] Task updated:", updatedTask);
    res
      .status(200)
      .json({ status: true, msg: "Task updated", task: updatedTask });
  } catch (error) {
    console.error("[updateTask] Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id || req.user.id,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

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

    const tasks = await Task.find({
      dueDate: { $lte: tomorrow },
      status: { $ne: "completed" },
      reminderSent: false,
    }).populate("userId", "email");

    let sentCount = 0;
    for (const task of tasks) {
      if (!task.userId?.email) continue;
      const message = `Reminder: Your task "${task.title}" is due soon.\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}`;
      await sendEmail(task.userId.email, "Task Reminder", message);
      await Task.findByIdAndUpdate(task._id, { reminderSent: true });
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
    const userId = req.user._id || req.user.id;
    const [total, completed, inProgress, pending, recurring] =
      await Promise.all([
        Task.countDocuments({ userId }),
        Task.countDocuments({ userId, status: "completed" }),
        Task.countDocuments({ userId, status: "in-progress" }),
        Task.countDocuments({ userId, status: "pending" }),
        Task.countDocuments({ userId, isRecurring: true }),
      ]);
    res.json({ total, completed, inProgress, pending, recurring });
  } catch (error) {
    res.status(500).json({ message: "Stats error", error: error.message });
  }
};

// ✅ COMPLETION GRAPH (last 7 days)
exports.getTaskCompletionGraph = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const tasks = await Task.find({
      userId,
      status: "completed",
      completedAt: { $ne: null },
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
    const tasks = await Task.find({ userId: req.user._id || req.user.id })
      .select("_id title description dueDate status")
      .sort({ dueDate: 1 });

    const events = tasks.map((task) => ({
      id: task._id,
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
    const userId = req.user._id || req.user.id;
    const formattedTasks = tasks.map((task) => ({ ...task, userId }));
    const created = await Task.insertMany(formattedTasks);
    res
      .status(201)
      .json({ message: "Tasks created successfully", tasks: created });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
