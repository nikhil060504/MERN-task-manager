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
    dateFilter: "all",
    startDate: "",
    endDate: "",
    day: "",
    month: "",
    year: "",
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
    const queryParams = {
      ...filters,
      sortBy: sortBy.field,
      order: sortBy.order,
    };
    dispatch(fetchTasks(queryParams));
  }, [dispatch, filters, sortBy]);

  // Expose fetchTasksData to TaskCard via prop
  const handleTaskListChange = () => {
    fetchTasksData();
    if (onTaskChange) onTaskChange();
  };

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

  // Since we're doing server-side filtering and sorting, just return tasks directly
  const filteredAndSortedTasks = useMemo(() => {
    return tasks || [];
  }, [tasks]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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

          {/* Date Filtering Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Date Filters
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quick Date Filter
                </label>
                <select
                  name="dateFilter"
                  value={filters.dateFilter}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  placeholder="e.g., 2024"
                  min="2020"
                  max="2030"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Month
                </label>
                <select
                  name="month"
                  value={filters.month}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specific Day
                </label>
                <input
                  type="number"
                  name="day"
                  value={filters.day}
                  onChange={handleFilterChange}
                  placeholder="Day (1-31)"
                  min="1"
                  max="31"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() =>
                    setFilters({
                      status: "all",
                      priority: "all",
                      category: "all",
                      search: "",
                      dateFilter: "all",
                      startDate: "",
                      endDate: "",
                      day: "",
                      month: "",
                      year: "",
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
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
          <TaskCard
            key={task.id || task._id}
            task={task}
            onTaskChange={handleTaskListChange}
          />
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
