import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const AddTask = () => {
 const authState = useSelector(state => state.authReducer);
  const [fetchData, { loading }] = useFetch();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'other',
    dueDate: ''
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending formData:", formData);
  
    const config = {
      url: '/tasks',
      method: 'post',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
      data: formData,
    };
  
    const data = await fetchData(config);
    console.log("Response from backend:", data);
  
    if (data?.task._id) {
      navigate('/tasks');
    } else {
      alert("Task not created. Check console for backend response.");
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="text"
    name="title"
    placeholder="Title"
    required
    value={formData.title}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />

  <textarea
    name="description"
    placeholder="Description"
    value={formData.description}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />

  <select
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="pending">Pending</option>
    <option value="in-progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <select
    name="priority"
    value={formData.priority}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="work">Work</option>
    <option value="personal">Personal</option>
    <option value="health">Health</option>
    <option value="school">School</option>
    <option value="other">Other</option>
  </select>

  {/* <input
    type="date"
    name="dueDate"
    value={formData.dueDate}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  /> */}
<div className="my-2">
  <label className="block mb-1 font-medium">Due Date & Time</label>
  <input
    type="datetime-local"
    name="dueDate"
    value={formData.dueDate}
    onChange={handleChange}
    required
    className="border p-2 rounded w-full"
  />
</div>



  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
    {loading ? 'Adding...' : 'Add Task'}
  </button>
</form>

    </div>
  );
};

export default AddTask;
