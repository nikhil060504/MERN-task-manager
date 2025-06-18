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
const { createTask, getTasks, getTaskStats, updateTask, deleteTask,getTaskById,getTaskCompletionGraph,getCalenderEvents } = require("../controllers/taskControllers");
const authMiddleware = require("../middleware/authMiddleware");
//const { protect } = require('../middleware/index');
const router = express.Router();

 //router.use(protect);
const { verifyAccessToken } = require('../middleware/index');


const { sendReminders } = require("../controllers/taskControllers");
router.get("/send-reminders", verifyAccessToken, sendReminders);
 router.get('/stats',authMiddleware, getTaskStats);
router.post("/", verifyAccessToken, createTask);

 router.get("/", authMiddleware, getTasks);
 // This must be before any protected route
router.get("/events", authMiddleware, getCalendarEvents);
 router.get('/completion-graph', verifyAccessToken, getTaskCompletionGraph);

 router.get("/:id", authMiddleware, getTaskById); 
 // router.get("/", authMiddleware, getAllTasks); 



router.put("/:id", authMiddleware, updateTask);

 router.delete("/:id", authMiddleware, deleteTask);





// Protected Routes


module.exports = router;

