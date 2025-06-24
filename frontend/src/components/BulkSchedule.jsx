import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const defaultTask = { title: "", dueTime: "", dueDate: "" };

const BulkSchedule = ({ onSuccess }) => {
  const [tasks, setTasks] = useState([{ ...defaultTask }]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTaskChange = (idx, field, value) => {
    setTasks((prev) =>
      prev.map((task, i) => (i === idx ? { ...task, [field]: value } : task))
    );
  };

  const addRow = () => setTasks((prev) => [...prev, { ...defaultTask }]);
  const removeRow = (idx) =>
    setTasks((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date for your schedule");
      return;
    }
    const validTasks = tasks.filter((t) => t.title && t.dueTime);
    if (validTasks.length === 0) {
      toast.error("Please enter at least one subject and time");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        tasks: validTasks.map((t) => ({
          ...t,
          dueDate: date,
          status: "pending",
          isRecurring: false,
          recurringType: "none",
        })),
      };
      await axios.post("/api/tasks/bulk", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Schedule added successfully!");
      setTasks([{ ...defaultTask }]);
      setDate("");
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error("Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Bulk Schedule (Student Mode)</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            className="p-2 border rounded w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <div className="grid grid-cols-12 gap-2 font-semibold mb-2">
            <div className="col-span-6">Subject</div>
            <div className="col-span-4">Time</div>
            <div className="col-span-2"></div>
          </div>
          {tasks.map((task, idx) => (
            <div className="grid grid-cols-12 gap-2 mb-2" key={idx}>
              <input
                className="col-span-6 p-2 border rounded"
                type="text"
                placeholder="Subject"
                value={task.title}
                onChange={(e) => handleTaskChange(idx, "title", e.target.value)}
                required
              />
              <input
                className="col-span-4 p-2 border rounded"
                type="time"
                value={task.dueTime}
                onChange={(e) =>
                  handleTaskChange(idx, "dueTime", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="col-span-2 px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                onClick={() => removeRow(idx)}
                disabled={tasks.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={addRow}
          >
            Add More
          </button>
        </div>
        <button
          type="submit"
          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          disabled={loading}
        >
          {loading ? "Saving..." : "Submit Schedule"}
        </button>
      </form>
    </div>
  );
};

export default BulkSchedule;
