import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from '../components/utils/Loader';
import Pagination from '../components/utils/Pagination';
//import TaskCard from '../components/TaskCard';

import Tooltip from './utils/Tooltip';

const Tasks = () => {

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    order: 'desc',
  });
  
  // const fetchTasks = useCallback(() => {
  //   const config = { url: "/tasks", method: "get", headers: { Authorization: `Bearer ${authState.token}` } };

  //   fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  // }, [authState.token, fetchData]);

  // const fetchTasks = useCallback((filters = {}) => {
  //   const query = new URLSearchParams(filters).toString();
  //   const config = {
  //     url: `/tasks${query ? `?${query}` : ''}`,
  //     method: "get",
  //     headers: { Authorization: `Bearer ${authState.token}` }
  //   };
  
  //   fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  // }, [authState.token, fetchData]);


  const fetchTasks = useCallback(() => {
    const params = new URLSearchParams({
      ...filters,
      search: searchTerm,
      page,
      limit: 5,
    }).toString();
  
    const config = {
      url: `/tasks?${params}`,
      method: "get",
      headers: { Authorization: `Bearer ${authState.token}` },
    };
  
    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data.tasks);
      setTotalPages(data.pages);
    });
  }, [authState.token, fetchData, searchTerm, page, filters]);
  
  

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);
    console.log("tasks",tasks);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: `Bearer ${authState.token}` } };

    fetchData(config).then(() => fetchTasks());
  }


  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
      <div className="flex justify-between items-center mb-4 mx-2 md:mx-0">
  <input
    type="text"
    placeholder="Search tasks..."
    className="border p-2 rounded-md w-full max-w-xs"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        fetchTasks();
      }
    }}
  />
</div>

      {tasks.length !== 0 && (
  <>
    <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({tasks.length})</h2>

    <div className="my-4 ml-2 md:ml-0">
      <label htmlFor="category" className="mr-2 font-medium">Filter by category:</label>
      <select
  id="category"
  className="border p-2 rounded-md"
  value={filters.category}
  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
>

        <option value="">All</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="health">Health</option>
        <option value="school">School</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div className="flex flex-wrap gap-4 ml-2 md:ml-0">
  <div>
    <label className="mr-2 font-medium">Status:</label>
    <select
  className="border p-2 rounded-md"
  value={filters.status}
  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
>

      <option value="">All</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
  </div>

  <div>
    <label className="mr-2 font-medium">Priority:</label>
    <select
  className="border p-2 rounded-md"
  value={filters.priority}
  onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
>

      <option value="">All</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  </div>

  <div>
    <label className="mr-2 font-medium">Sort By:</label>
    <select
  className="border p-2 rounded-md"
  value={`${filters.sortBy}:${filters.order}`}
  onChange={(e) => {
    const [sortBy, order] = e.target.value.split(':');
    setFilters((prev) => ({ ...prev, sortBy, order }));
  }}
>

      <option value="createdAt:desc">Newest</option>
      <option value="createdAt:asc">Oldest</option>
      <option value="title:asc">Title A-Z</option>
      <option value="title:desc">Title Z-A</option>
    </select>
  </div>
</div>

  </>
)}

        {loading ? (
          <Loader />
        ) : (
          <div>
            {tasks.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No tasks found</span>
                <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
              </div>

            ) : (
 

              tasks.map((task, index) => (
                <div key={task._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>

                    <span className='font-medium'>Task #{index + 1}</span>

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>

                  </div>
                  <div className='whitespace-pre mb-1'>{task.description}</div>
{task.category && (
  <div className='text-sm text-blue-600 font-medium'>
    Category: {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
  </div>
)}
{totalPages > 1 && (
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={(newPage) => {
      setPage(newPage);
    }}
  />
)}


                </div>
              ))

            )}
            <button
  className="ml-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
  onClick={() => setFilters({ category: '', status: '', priority: '', sortBy: 'createdAt', order: 'desc' })}
>
  Reset Filters
</button>

          </div>
        )}
      </div>
    </>
  )

}

export default Tasks