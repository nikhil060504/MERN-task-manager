// const express = require("express");
// const router = express.Router();
// const { getTasks, getTask, postTask, putTask, deleteTask } = require("../controllers/taskControllers.js");
// const { verifyAccessToken } = require("../middlewares.js");

// // Routes beginning with /api/tasks
// router.get("/", verifyAccessToken, getTasks);
// router.get("/:taskId", verifyAccessToken, getTask);
// router.post("/", verifyAccessToken, postTask);
// router.put("/:taskId", verifyAccessToken, putTask);
// router.delete("/:taskId", verifyAccessToken, deleteTask);

// module.exports = router;

const express = require("express");
const {
  createTask,
  getTasks,
  getTaskStats,
  updateTask,
  deleteTask,
  getTaskById,
  getTaskCompletionGraph,
  getCalenderEvents,
  bulkCreateTasks,
  sendReminders,
} = require("../controllers/taskControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Use authMiddleware consistently for all routes
router.get("/stats", authMiddleware, getTaskStats);
router.get("/send-reminders", authMiddleware, sendReminders);
router.get("/events", authMiddleware, getCalenderEvents);
router.get("/completion-graph", authMiddleware, getTaskCompletionGraph);

// CRUD operations
router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.post("/bulk", authMiddleware, bulkCreateTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
