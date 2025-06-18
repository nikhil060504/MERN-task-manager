// const Task = require("../models/Task");
// const { validateObjectId } = require("../utils/validation");


// exports.getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user.id });
//     res.status(200).json({ tasks, status: true, msg: "Tasks found successfully.." });
//   }
//   catch (err) {
//     console.error(err);
//     return res.status(500).json({ status: false, msg: "Internal Server Error" });
//   }
// }

// exports.getTask = async (req, res) => {
//   try {
//     if (!validateObjectId(req.params.taskId)) {
//       return res.status(400).json({ status: false, msg: "Task id not valid" });
//     }

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
    const { title, description, status, dueDate, category, priority } = req.body;

    const task = new Task({
      user: req.user._id,
      title,
      description,
      status,
      dueDate,
      category,
      priority, 
     /*  reminderDate: reminderDate || null, */
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

//     if (status) filter.status = status;
//     if (priority) filter.priority = priority;

//     const tasks = await Task.find(filter).sort({ createdAt: -1 });
//     res.json(tasks);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const { status, priority, category, sortBy, order, page = 1, limit = 10 } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    //console.log("Fetching tasks for user:", req.user._id);

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i'); // case-insensitive
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }
    
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // default: latest first
    }

    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

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


// GET /tasks?status=completed&sortBy=dueDate&order=asc


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user._id) {
      return res.status(404).json({ message: "Task not found or unauthorized" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure the task belongs to the user making the request
    if (task.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
if (req.body.isCompleted === true && task.isCompleted === false) {
  task.completedAt = new Date();
}

    // Update the fields with the request body
    Object.assign(task, req.body);
    await task.save();

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user._id) return res.status(401).json({ message: "Unauthorized" });

    await task.remove();
    res.json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendReminders = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await Task.find({
  dueDate: { $lte: tomorrow },
  status: { $ne: "completed" },
  reminderSent: false
}).populate("user", "email");


    let sentCount = 0;

 for (const task of tasks) {
  if (!task.user?.email) continue;

  const message = `Reminder: Your task "${task.title}" is due soon.\n\nDescription: ${task.description}\nDue Date: ${task.dueDate}`;
  
  await sendEmail(task.user.email, "Task Reminder", message);
  task.reminderSent = true; // ✅ Mark as sent
  await task.save();        // ✅ Save to DB

  sentCount++;
}


    res.status(200).json({ message: `${sentCount} reminder(s) sent.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reminders", error: err.message });
  }
};




exports.getTaskStats = async (req, res) => {
  try {
    console.log("🔥 getStats called");
    console.log("🧑 req.user =", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: 'Unauthorized - No user' });
    }

    console.time("📊 Count Total");
    const total = await Task.countDocuments({ user: req.user._id });
    console.timeEnd("📊 Count Total");

    console.time("✅ Count Completed");
    const completed = await Task.countDocuments({ user: req.user._id, status: 'completed' });
    console.timeEnd("✅ Count Completed");

    console.time("🕐 Count Pending");
    const pending = await Task.countDocuments({ user: req.user._id, status: 'pending' });
    console.timeEnd("🕐 Count Pending");

    console.time("🔁 Count Recurring");
    const recurring = await Task.countDocuments({
      user: req.user._id,
      reminderDate: { $ne: null }
    });
    console.timeEnd("🔁 Count Recurring");

    return res.json({ total, completed, pending, recurring });
  } catch (error) {
    console.error("❌ Error in getStats:", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};



exports.getTaskCompletionGraph = async (req, res) => {
  try {
   const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const past7Days = [...Array(7)].map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    }).reverse();

    const stats = await Task.aggregate([
      {
        $match: {
          user: req.userId,
          isCompleted: true,
          completedAt: { $gte: new Date(past7Days[0]) },
        },
      },
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$completedAt" }
          }
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = past7Days.map((date) => {
      const found = stats.find((d) => d._id === date);
      return { date, count: found ? found.count : 0 };
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Error fetching graph data", error: err.message });
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

