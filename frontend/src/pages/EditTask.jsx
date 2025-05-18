import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useFetch from '../hooks/useFetch';
import Loader from '../components/utils/Loader';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const authState = useSelector(state => state.authReducer);
  const [fetchData, { loading }] = useFetch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'other',
    dueDate:'',
  });

  useEffect(() => {
    const fetchTask = async () => {
      const config = {
        url: `/tasks/${id}`,
        method: 'get',
        headers: { Authorization: `Bearer ${authState.token}` },
      };
      const data = await fetchData(config, { showSuccessToast: false });
      setFormData({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        category: data.category,
         dueDate: data.dueDate?.slice(0, 16),
      });
    };
    fetchTask();
  }, [id, authState.token, fetchData]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const config = {
      url: `/tasks/${id}`,
      method: 'put',
      headers: { Authorization: `Bearer ${authState.token}` },
      data: formData,
    };
    await fetchData(config);
    navigate('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>

      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full px-4 py-2 border rounded-md"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full px-4 py-2 border rounded-md"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-md">
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="school">School</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
  <label className="block mb-1 font-medium">Due Date & Time</label>
  <input
    type="datetime-local"
    name="dueDate"
    value={formData.dueDate}
    onChange={handleChange}
    required
    className="w-full px-4 py-2 border rounded-md"
  />
</div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditTask;
