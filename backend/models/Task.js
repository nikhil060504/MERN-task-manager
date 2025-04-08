// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   description: {
//     type: String,
//     required: true,
//   },
// }, {
//   timestamps: true
// });


// const Task = mongoose.model("Task", taskSchema);
// module.exports = Task;






// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   description: {
//     type: String,
//     required: true,
//   },
//   priority: {
//     type: String,
//     enum: ["high", "medium", "low"],
//     default: "medium"
//   },
//   status: {
//     type: String,
//     enum: ["pending", "completed"],
//     default: "pending"
//   },
//   dueDate: {
//     type: Date,
//     default: null
//   }
// }, {
//   timestamps: true
// });

// const Task = mongoose.model("Task", taskSchema);
// module.exports = Task;





const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'school', 'other'],
    default: 'other',
  },
  dueDate: Date,
  reminderDate: {
    type: Date,
    default: null,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

