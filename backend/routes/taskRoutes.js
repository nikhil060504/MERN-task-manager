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
const { createTask, getTasks,getAllTasks, getTaskStats, updateTask, deleteTask } = require("../controllers/taskControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


const { verifyAccessToken } = require('../middleware/index.js');


const { sendReminders } = require("../controllers/taskControllers");
router.get("/send-reminders", sendReminders);
router.post("/", verifyAccessToken, createTask);

router.get("/", authMiddleware, getTasks);
router.get("/", authMiddleware, getAllTasks); 
router.get('/stats', authMiddleware, getTaskStats);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;

