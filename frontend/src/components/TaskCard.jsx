import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask } from "../redux/actions/taskActions";
import { FaTrash, FaCheck, FaClock, FaFlag, FaTag } from "react-icons/fa";
import { toast } from "react-hot-toast";

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const categoryColors = {
  work: "bg-blue-100 text-blue-800",
  personal: "bg-purple-100 text-purple-800",
  health: "bg-pink-100 text-pink-800",
  school: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800",
};

const TaskCard = ({ task, onTaskChange }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState({ ...task });

  // Helper to check if due date/time is in the past
  const isPastDue = (() => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    if (task.dueTime) {
      const [h, m] = task.dueTime.split(":");
      due.setHours(Number(h), Number(m), 0, 0);
    }
    return due < new Date();
  })();

  const handleDelete = () => {
    dispatch(deleteTask(task._id)).then(() => {
      if (onTaskChange) onTaskChange();
    });
    toast.success("Task deleted successfully!");
  };

  const handleStatusChange = async (e) => {
    try {
      // Stop event propagation to prevent card click
      e.stopPropagation();

      // Toggle status correctly based on current status
      let newStatus;
      if (task.status === "completed") {
        newStatus = "pending";
      } else if (task.status === "pending") {
        newStatus = "completed";
      } else {
        newStatus = "completed"; // Default to completed if in any other state
      }

      // Log the status change
      console.log("[TaskCard] Status change:", {
        oldStatus: task.status,
        newStatus,
        taskId: task._id,
      });

      const updatedData = {
        ...task,
        status: newStatus,
        completedAt:
          newStatus === "completed" ? new Date().toISOString() : null,
      };

      await dispatch(updateTask(task._id, updatedData));

      // Immediately show feedback
      toast.success(`Task marked as ${newStatus}`);

      // Refresh task list to update counts
      if (onTaskChange) onTaskChange();
    } catch (error) {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const renderStatusButton = () => {
    if (task.status === "completed") {
      return (
        <button
          onClick={handleStatusChange}
          className="text-green-500 hover:text-green-600 transition-colors"
          title="Mark as pending"
        >
          <FaCheck className="text-xl" />
        </button>
      );
    } else {
      return (
        <button
          onClick={handleStatusChange}
          className="text-gray-400 hover:text-gray-500 transition-colors"
          title="Mark as completed"
        >
          <FaClock className="text-xl" />
        </button>
      );
    }
  };

  const handleCardClick = (e) => {
    // Prevent modal from opening when clicking on action buttons
    if (e.target.closest("button")) return;
    setEditTask({ ...task });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditTask((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await dispatch(updateTask(task._id, editTask));
      setIsEditing(false);
      if (onTaskChange) onTaskChange();
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-6 mb-4 transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3
              className={`text-xl font-semibold mb-2 ${
                task.status === "completed"
                  ? "line-through text-gray-500"
                  : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  priorityColors[task.priority]
                }`}
              >
                <FaFlag className="inline mr-1" /> {task.priority}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  categoryColors[task.category]
                }`}
              >
                <FaTag className="inline mr-1" /> {task.category}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {renderStatusButton()}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-red-500 hover:text-red-600 transition-colors"
              title="Delete task"
            >
              <FaTrash className="text-xl" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{task.description}</p>
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 gap-2">
          <span
            className={`px-3 py-1 rounded-full ${
              task.status === "completed"
                ? "bg-green-100 text-green-800"
                : isPastDue
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {isPastDue ? "Overdue" : task.status}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {task.dueTime && ` at ${task.dueTime}`}
            </span>
            {task.isRecurring && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {task.recurringType}
              </span>
            )}
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              className="w-full p-2 border rounded mb-4"
              value={editTask.title}
              onChange={handleEditChange}
            />
            <textarea
              name="description"
              placeholder="Task Description"
              className="w-full p-2 border rounded mb-4"
              value={editTask.description}
              onChange={handleEditChange}
            />
            <div className="flex space-x-2 mb-4">
              <input
                type="date"
                name="dueDate"
                className="w-1/2 p-2 border rounded"
                value={editTask.dueDate ? editTask.dueDate.slice(0, 10) : ""}
                onChange={handleEditChange}
              />
              <input
                type="time"
                name="dueTime"
                className="w-1/2 p-2 border rounded"
                value={editTask.dueTime || ""}
                onChange={handleEditChange}
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isRecurring"
                id="isRecurringEdit"
                checked={editTask.isRecurring}
                onChange={handleEditChange}
                className="mr-2"
              />
              <label htmlFor="isRecurringEdit" className="mr-2">
                Recurring
              </label>
              <select
                name="recurringType"
                className="p-2 border rounded"
                value={editTask.recurringType}
                onChange={handleEditChange}
                disabled={!editTask.isRecurring}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <select
              name="status"
              className="w-full p-2 border rounded mb-4"
              value={editTask.status}
              onChange={handleEditChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
