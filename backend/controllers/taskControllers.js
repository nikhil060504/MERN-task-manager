// const Task = require("../models/Task");
// const sendEmail = require("../utils/email");
// exports.createTask = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       status,
//       dueDate,
//       dueTime,
//       category,
//       priority,
//       isRecurring,
//       recurringType,
//     } = req.body;

<<<<<<< HEAD
//     const task = new Task({
//       user: req.user._id,
//       title,
//       description,
//       status,
//       dueDate,
//       dueTime,
//       category,
//       priority,
//       isRecurring,
//       recurringType,
//     });

//     await task.save();
//     res.status(201).json({ message: "Task created successfully", task });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: error.message });
//   }
// };

// // exports.getTasks = async (req, res) => {
// //   try {
// //     const { status, priority } = req.query;
// //     const filter = { user: req.user.id };

// //     if (status) filter.status = status;
// //     if (priority) filter.priority = priority;

// //     const tasks = await Task.find(filter).sort({ createdAt: -1 });
// //     res.json(tasks);

// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// //const Task = require('../models/Task');

=======
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
// exports.getTasks = async (req, res) => {
//   try {
//     if (!req.user?._id) {
//       return res.status(401).json({
//         status: false,
//         msg: "Authentication required",
//       });
//     }

<<<<<<< HEAD
//     const {
//       status,
//       priority,
//       category,
//       sortBy,
//       order,
//       page = 1,
//       limit = 10,
//     } = req.query;
=======
//     const task = await Task.findOne({ user: req.user.id, _id: req.params.taskId });
//     if (!task) {
//       return res.status(400).json({ status: false, msg: "No task found.." });
//     }
//     res.status(200).json({ task, status: true, msg: "Task found successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }

// exports.postTask = async (req, res) => {
//   try {
//     const { description } = req.body;
//     if (!description) {
//       return res.status(400).json({ status: false, msg: "Description of task not found" });
//     }
//     const task = await Task.create({ user: req.user.id, description });
//     res.status(200).json({ task, status: true, msg: "Task created successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }

// exports.putTask = async (req, res) => {
//   try {
//     const { description } = req.body;
//     if (!description) {
//       return res.status(400).json({ status: false, msg: "Description of task not found" });
//     }

//     if (!validateObjectId(req.params.taskId)) {
//       return res.status(400).json({ status: false, msg: "Task id not valid" });
//     }

//     let task = await Task.findById(req.params.taskId);
//     if (!task) {
//       return res.status(400).json({ status: false, msg: "Task with given id not found" });
//     }

//     if (task.user != req.user.id) {
//       return res.status(403).json({ status: false, msg: "You can't update task of another user" });
//     }

//     task = await Task.findByIdAndUpdate(req.params.taskId, { description }, { new: true });
//     res.status(200).json({ task, status: true, msg: "Task updated successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }

// exports.deleteTask = async (req, res) => {
//   try {
//     if (!validateObjectId(req.params.taskId)) {
//       return res.status(400).json({ status: false, msg: "Task id not valid" });
//     }

//     let task = await Task.findById(req.params.taskId);
//     if (!task) {
//       return res.status(400).json({ status: false, msg: "Task with given id not found" });
//     }

//     if (task.user != req.user.id) {
//       return res.status(403).json({ status: false, msg: "You can't delete task of another user" });
//     }

//     await Task.findByIdAndDelete(req.params.taskId);
//     res.status(200).json({ status: true, msg: "Task deleted successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }

const Task = require("../models/Task");
const sendEmail = require("../utils/email");
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

    const task = new Task({
      user: req.user._id,
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

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// exports.getTasks = async (req, res) => {
//   try {
//     const { status, priority } = req.query;
//     const filter = { user: req.user.id };
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d

//     const filter = { user: req.user._id };
//     if (status) filter.status = status;
//     if (priority) filter.priority = priority;
//     if (category) filter.category = category;
//     //console.log("Fetching tasks for user:", req.user._id);

//     if (req.query.search) {
//       const searchRegex = new RegExp(req.query.search, "i"); // case-insensitive
//       filter.$or = [{ title: searchRegex }, { description: searchRegex }];
//     }

//     const sortOptions = {};
//     if (sortBy) {
//       sortOptions[sortBy] = order === "asc" ? 1 : -1;
//     } else {
//       sortOptions.createdAt = -1; // default: latest first
//     }

//     const tasks = await Task.find(filter)
//       .sort(sortOptions)
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));

//     const total = await Task.countDocuments(filter);

//     res.status(200).json({
//       tasks,
//       total,
//       page: parseInt(page),
//       pages: Math.ceil(total / limit),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // GET /tasks?status=completed&sortBy=dueDate&order=asc

// exports.getTaskById = async (req, res) => {
//   try {
//     if (!req.user?._id) {
//       return res.status(401).json({
//         status: false,
//         msg: "Authentication required",
//       });
//     }

//     const task = await Task.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!task) {
//       return res.status(404).json({
//         status: false,
//         msg: "Task not found",
//       });
//     }

//     res.status(200).json({
//       task,
//       status: true,
//       msg: "Task found successfully",
//     });
//   } catch (err) {
//     console.error("Error in getTaskById:", err);
//     return res.status(500).json({
//       status: false,
//       msg: "Internal Server Error",
//       error: err.message,
//     });
//   }
// };

// exports.updateTask = async (req, res) => {
//   try {
//     // Log the incoming request
//     console.log("[updateTask] Request:", {
//       user: req.user?._id,
//       taskId: req.params.id,
//       body: req.body,
//     });

//     // Validate user
//     if (!req.user?._id) {
//       console.log("[updateTask] No authenticated user");
//       return res.status(401).json({
//         status: false,
//         msg: "Authentication required",
//       });
//     }

//     const taskId = req.params.id;
//     if (!taskId) {
//       console.log("[updateTask] No task ID provided");
//       return res.status(400).json({
//         status: false,
//         msg: "Task ID is required",
//       });
//     }

//     // Find the task and verify ownership
//     const task = await Task.findOne({
//       _id: taskId,
//       user: req.user._id,
//     });

//     if (!task) {
//       console.log("[updateTask] Task not found or access denied:", {
//         taskId,
//         userId: req.user._id,
//       });
//       return res.status(404).json({
//         status: false,
//         msg: "Task not found or access denied",
//       });
//     }

//     // Update allowed fields
//     const allowedUpdates = [
//       "title",
//       "description",
//       "status",
//       "priority",
//       "category",
//       "dueDate",
//       "dueTime",
//       "reminderDate",
//       "isRecurring",
//       "completedAt",
//     ];

//     // Filter and validate updates
//     const updates = Object.keys(req.body)
//       .filter((key) => allowedUpdates.includes(key))
//       .reduce((obj, key) => {
//         if (req.body[key] !== undefined) {
//           obj[key] = req.body[key];
//         }
//         return obj;
//       }, {});

//     // Validate status if it's being updated
//     if (
//       updates.status &&
//       !["pending", "in-progress", "completed"].includes(updates.status)
//     ) {
//       return res.status(400).json({
//         status: false,
//         msg: "Invalid status value",
//       });
//     }

//     // Handle status change completion date
//     if (updates.status === "completed" && task.status !== "completed") {
//       updates.completedAt = new Date();
//     } else if (updates.status && updates.status !== "completed") {
//       updates.completedAt = null;
//     }

//     // Apply updates
//     Object.assign(task, updates);
//     await task.save();

//     console.log("[updateTask] Task updated successfully:", task);

//     res.status(200).json({
//       status: true,
//       msg: "Task updated successfully",
//       task,
//     });
//   } catch (err) {
//     console.error("[updateTask] Error:", err);
//     return res.status(500).json({
//       status: false,
//       msg: "Failed to update task",
//       error: err.message,
//     });
//   }
// };

// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     if (task.user.toString() !== req.user._id)
//       return res.status(401).json({ message: "Unauthorized" });

//     await task.remove();
//     res.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.sendReminders = async (req, res) => {
//   try {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const tasks = await Task.find({
//       dueDate: { $lte: tomorrow },
//       status: { $ne: "completed" },
//       reminderSent: false,
//     }).populate("user", "email");

//     let sentCount = 0;

//     for (const task of tasks) {
//       if (!task.user?.email) continue;

//       const message = `Reminder: Your task "${task.title}" is due soon.\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}`;

//       await sendEmail(task.user.email, "Task Reminder", message);
//       task.reminderSent = true; // ✅ Mark as sent
//       await task.save(); // ✅ Save to DB

//       sentCount++;
//     }

//     res.status(200).json({ message: `${sentCount} reminder(s) sent.` });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Failed to send reminders", error: err.message });
//   }
// };

// exports.getTaskStats = async (req, res) => {
//   try {
//     console.log("🔥 getStats called");
//     console.log("🧑 req.user =", req.user);

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ msg: "Unauthorized - No user" });
//     }

//     // Get all counts in parallel for better performance
//     const [total, completed, inProgress, pending, recurring] =
//       await Promise.all([
//         Task.countDocuments({ user: req.user._id }),
//         Task.countDocuments({
//           user: req.user._id,
//           status: "completed",
//         }),
//         Task.countDocuments({
//           user: req.user._id,
//           status: "in-progress",
//         }),
//         Task.countDocuments({
//           user: req.user._id,
//           status: "pending",
//         }),
//         Task.countDocuments({
//           user: req.user._id,
//           isRecurring: true,
//         }),
//       ]);

//     console.log("Stats calculated:", {
//       total,
//       completed,
//       inProgress,
//       pending,
//       recurring,
//     });

//     return res.json({
//       total,
//       completed,
//       inProgress,
//       pending,
//       recurring,
//       msg: "Stats retrieved successfully",
//     });
//   } catch (error) {
//     console.error("❌ Error in getStats:", error);
//     return res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// exports.getTaskCompletionGraph = async (req, res) => {
//   try {
//     // Log the request for debugging
//     console.log(
//       "[getTaskCompletionGraph] Fetching data for user:",
//       req.user._id
//     );

//     // Get all tasks for the user
//     const tasks = await Task.find({ user: req.user._id });

//     // Get the last 7 days including today
//     const last7Days = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date();
//       date.setHours(0, 0, 0, 0); // Set to start of day
//       date.setDate(date.getDate() - i);
//       return date;
//     }).reverse();

//     // Count completed tasks for each day
//     const completionData = last7Days.map((date) => {
//       const dayStart = new Date(date);
//       const dayEnd = new Date(date);
//       dayEnd.setDate(dayEnd.getDate() + 1);

//       const completedTasks = tasks.filter((task) => {
//         // Task must be completed and have a completedAt date
//         if (task.status !== "completed" || !task.completedAt) {
//           return false;
//         }

//         // Check if the task was completed on this day
//         const completedAt = new Date(task.completedAt);
//         return completedAt >= dayStart && completedAt < dayEnd;
//       }).length;

//       // Format date for display (e.g., "Jun 16")
//       const formattedDate = date.toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });

//       const isToday = new Date().toDateString() === date.toDateString();

//       return {
//         date: formattedDate,
//         completed: completedTasks,
//         isToday,
//       };
//     });

//     // Log the results for debugging
//     console.log("[getTaskCompletionGraph] Completion data:", completionData);

//     res.status(200).json(completionData);
//   } catch (error) {
//     console.error("[getTaskCompletionGraph] Error:", error);
//     res.status(500).json({ message: "Error fetching completion graph data" });
//   }
// };

// // controllers/calendarController.js

// exports.holidays = require("../data/holidays");

// // Get all holidays and festivals
// exports.getCalendarEvents = async (req, res) => {
//   try {
//     return res.status(200).json({ success: true, events: holidays });
//   } catch (error) {
//     console.error("❌ Error in getCalendarEvents:", error);
//     return res.status(500).json({ success: false, msg: "Server error" });
//   }
// };

// exports.getCalenderEvents = async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user._id })
//       .select("title description dueDate status")
//       .sort({ dueDate: 1 });

//     const events = tasks.map((task) => ({
//       id: task._id,
//       title: task.title,
//       description: task.description,
//       start: task.dueDate,
//       status: task.status,
//     }));

//     res.status(200).json(events);
//   } catch (error) {
//     console.error("Error fetching calendar events:", error);
//     res.status(500).json({ message: "Error fetching calendar events" });
//   }
// };

// exports.bulkCreateTasks = async (req, res) => {
//   try {
//     const { tasks } = req.body; // tasks: array of {title, dueDate, dueTime, ...}
//     if (!Array.isArray(tasks) || tasks.length === 0) {
//       return res.status(400).json({ message: "No tasks provided" });
//     }
//     const userId = req.user._id;
//     const createdTasks = await Promise.all(
//       tasks.map((taskData) => {
//         return new Task({ ...taskData, user: userId }).save();
//       })
//     );
//     res
//       .status(201)
//       .json({ message: "Tasks created successfully", tasks: createdTasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

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
<<<<<<< HEAD
=======
    if (!req.user?._id) {
      return res.status(401).json({
        status: false,
        msg: "Authentication required",
      });
    }

>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
    const {
      status,
      priority,
      category,
<<<<<<< HEAD
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const filter = { userId: req.user.id };
=======
      sortBy,
      order,
      page = 1,
      limit = 10,
    } = req.query;
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

<<<<<<< HEAD
    if (search) {
      filter[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
=======
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i"); // case-insensitive
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // default: latest first
    }
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d

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

<<<<<<< HEAD
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
=======
// GET /tasks?status=completed&sortBy=dueDate&order=asc

exports.getTaskById = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        status: false,
        msg: "Authentication required",
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        status: false,
        msg: "Task not found",
      });
    }

    res.status(200).json({
      task,
      status: true,
      msg: "Task found successfully",
    });
  } catch (err) {
    console.error("Error in getTaskById:", err);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Log the incoming request
    console.log("[updateTask] Request:", {
      user: req.user?._id,
      taskId: req.params.id,
      body: req.body,
    });

    // Validate user
    if (!req.user?._id) {
      console.log("[updateTask] No authenticated user");
      return res.status(401).json({
        status: false,
        msg: "Authentication required",
      });
    }

    const taskId = req.params.id;
    if (!taskId) {
      console.log("[updateTask] No task ID provided");
      return res.status(400).json({
        status: false,
        msg: "Task ID is required",
      });
    }

    // Find the task and verify ownership
    const task = await Task.findOne({
      _id: taskId,
      user: req.user._id,
    });

    if (!task) {
      console.log("[updateTask] Task not found or access denied:", {
        taskId,
        userId: req.user._id,
      });
      return res.status(404).json({
        status: false,
        msg: "Task not found or access denied",
      });
    }

    // Update allowed fields
    const allowedUpdates = [
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

    // Filter and validate updates
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        if (req.body[key] !== undefined) {
          obj[key] = req.body[key];
        }
        return obj;
      }, {});

    // Validate status if it's being updated
    if (
      updates.status &&
      !["pending", "in-progress", "completed"].includes(updates.status)
    ) {
      return res.status(400).json({
        status: false,
        msg: "Invalid status value",
      });
    }

    // Handle status change completion date
    if (updates.status === "completed" && task.status !== "completed") {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== "completed") {
      updates.completedAt = null;
    }

    // Apply updates
    Object.assign(task, updates);
    await task.save();

    console.log("[updateTask] Task updated successfully:", task);

    res.status(200).json({
      status: true,
      msg: "Task updated successfully",
      task,
    });
  } catch (err) {
    console.error("[updateTask] Error:", err);
    return res.status(500).json({
      status: false,
      msg: "Failed to update task",
      error: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id)
      return res.status(401).json({ message: "Unauthorized" });

    await task.remove();
    res.json({ message: "Task deleted successfully" });
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
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
      console.log("[updateTask] Setting completedAt:", updates.completedAt);
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

<<<<<<< HEAD
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
=======
    const tasks = await Task.find({
      dueDate: { $lte: tomorrow },
      status: { $ne: "completed" },
      reminderSent: false,
    }).populate("user", "email");
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d

    let sentCount = 0;

    for (const task of tasks) {
<<<<<<< HEAD
      if (!task.User?.email) continue;

      const message = `Reminder: Your task "${task.title}" is due soon.\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}`;

      await sendEmail(task.User.email, "Task Reminder", message);

      await task.update({ reminderSent: true });
=======
      if (!task.user?.email) continue;

      const message = `Reminder: Your task "${task.title}" is due soon.\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}`;

      await sendEmail(task.user.email, "Task Reminder", message);
      task.reminderSent = true; // ✅ Mark as sent
      await task.save(); // ✅ Save to DB

>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
      sentCount++;
    }

    res.status(200).json({ message: `${sentCount} reminder(s) sent.` });
<<<<<<< HEAD
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
=======
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to send reminders", error: err.message });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    console.log("🔥 getStats called");
    console.log("🧑 req.user =", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Unauthorized - No user" });
    }

    // Get all counts in parallel for better performance
    const [total, completed, inProgress, pending, recurring] =
      await Promise.all([
        Task.countDocuments({ user: req.user._id }),
        Task.countDocuments({
          user: req.user._id,
          status: "completed",
        }),
        Task.countDocuments({
          user: req.user._id,
          status: "in-progress",
        }),
        Task.countDocuments({
          user: req.user._id,
          status: "pending",
        }),
        Task.countDocuments({
          user: req.user._id,
          isRecurring: true,
        }),
      ]);

    console.log("Stats calculated:", {
      total,
      completed,
      inProgress,
      pending,
      recurring,
    });

    return res.json({
      total,
      completed,
      inProgress,
      pending,
      recurring,
      msg: "Stats retrieved successfully",
    });
  } catch (error) {
    console.error("❌ Error in getStats:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getTaskCompletionGraph = async (req, res) => {
  try {
    // Log the request for debugging
    console.log(
      "[getTaskCompletionGraph] Fetching data for user:",
      req.user._id
    );

    // Get all tasks for the user
    const tasks = await Task.find({ user: req.user._id });

    // Get the last 7 days including today
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0); // Set to start of day
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // Count completed tasks for each day
    const completionData = last7Days.map((date) => {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const completedTasks = tasks.filter((task) => {
        // Task must be completed and have a completedAt date
        if (task.status !== "completed" || !task.completedAt) {
          return false;
        }

        // Check if the task was completed on this day
        const completedAt = new Date(task.completedAt);
        return completedAt >= dayStart && completedAt < dayEnd;
      }).length;

      // Format date for display (e.g., "Jun 16")
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const isToday = new Date().toDateString() === date.toDateString();

      return {
        date: formattedDate,
        completed: completedTasks,
        isToday,
      };
    });

    // Log the results for debugging
    console.log("[getTaskCompletionGraph] Completion data:", completionData);

    res.status(200).json(completionData);
  } catch (error) {
    console.error("[getTaskCompletionGraph] Error:", error);
    res.status(500).json({ message: "Error fetching completion graph data" });
  }
};

// controllers/calendarController.js

exports.holidays = require("../data/holidays");

// Get all holidays and festivals
exports.getCalendarEvents = async (req, res) => {
  try {
    return res.status(200).json({ success: true, events: holidays });
  } catch (error) {
    console.error("❌ Error in getCalendarEvents:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};

exports.getCalenderEvents = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id })
      .select("title description dueDate status")
      .sort({ dueDate: 1 });

    const events = tasks.map((task) => ({
      id: task._id,
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
      title: task.title,
      description: task.description,
      start: task.dueDate,
      status: task.status,
    }));

    res.status(200).json(events);
  } catch (error) {
<<<<<<< HEAD
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
=======
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ message: "Error fetching calendar events" });
  }
};

exports.bulkCreateTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // tasks: array of {title, dueDate, dueTime, ...}
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ message: "No tasks provided" });
    }
    const userId = req.user._id;
    const createdTasks = await Promise.all(
      tasks.map((taskData) => {
        return new Task({ ...taskData, user: userId }).save();
      })
    );
    res
      .status(201)
      .json({ message: "Tasks created successfully", tasks: createdTasks });
  } catch (error) {
    console.error(error);
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
    res.status(500).json({ message: error.message });
  }
};
