import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask } from "../redux/actions/taskActions";
import TaskCard from "./TaskCard";
import { FaPlus, FaFilter, FaSort } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Tasks = ({ onTaskChange }) => {
  const dispatch = useDispatch();
  const {
    tasks = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.tasks) || {};
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
  });
  const [sortBy, setSortBy] = useState({ field: "dueDate", order: "asc" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "pending",
    priority: "medium",
    category: "personal",
    isRecurring: false,
    recurringType: "none",
  });

  const fetchTasksData = useCallback(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await dispatch(addTask(newTask));
      setIsAddingTask(false);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        status: "pending",
        priority: "medium",
        category: "personal",
        isRecurring: false,
        recurringType: "none",
      });
      // Refresh the tasks list
      fetchTasksData();
    } catch (err) {
      toast.error(err.message || "Failed to add task");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (field) => {
    setSortBy((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority);
    }
    if (filters.category !== "all") {
      result = result.filter((task) => task.category === filters.category);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy.field) {
        case "dueDate":
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = 0;
      }
      return sortBy.order === "asc" ? comparison : -comparison;
    });

    return result;
  }, [tasks, filters, sortBy]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
        <button
          onClick={fetchTasksData}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          <button
            onClick={() => setIsAddingTask(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow"
          >
            <FaPlus className="mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tasks..."
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="all">All</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="school">School</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange("dueDate")}
            className={`px-3 py-1 rounded ${
              sortBy.field === "dueDate"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100"
            }`}
          >
            <FaSort className="inline mr-1" />
            Due Date{" "}
            {sortBy.field === "dueDate" && (sortBy.order === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortChange("priority")}
            className={`px-3 py-1 rounded ${
              sortBy.field === "priority"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100"
            }`}
          >
            <FaSort className="inline mr-1" />
            Priority{" "}
            {sortBy.field === "priority" &&
              (sortBy.order === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() => handleSortChange("title")}
            className={`px-3 py-1 rounded ${
              sortBy.field === "title"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100"
            }`}
          >
            <FaSort className="inline mr-1" />
            Title{" "}
            {sortBy.field === "title" && (sortBy.order === "asc" ? "↑" : "↓")}
          </button>
        </div>
      </div>

      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              className="w-full p-2 border rounded mb-4"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Task Description"
              className="w-full p-2 border rounded mb-4"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <div className="flex space-x-2 mb-4">
              <input
                type="date"
                className="w-1/2 p-2 border rounded"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
              <input
                type="time"
                className="w-1/2 p-2 border rounded"
                value={newTask.dueTime}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueTime: e.target.value })
                }
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="isRecurring"
                checked={newTask.isRecurring}
                onChange={(e) =>
                  setNewTask({ ...newTask, isRecurring: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="isRecurring" className="mr-2">
                Recurring
              </label>
              <select
                className="p-2 border rounded"
                value={newTask.recurringType}
                onChange={(e) =>
                  setNewTask({ ...newTask, recurringType: e.target.value })
                }
                disabled={!newTask.isRecurring}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-6 shadow-inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedTasks.map((task) => (
          <TaskCard key={task._id} task={task} onTaskChange={onTaskChange} />
        ))}
        {filteredAndSortedTasks.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No tasks found matching your filters
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
