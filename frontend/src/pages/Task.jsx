// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Textarea } from '../components/utils/Input';
// import Loader from '../components/utils/Loader';
// import useFetch from '../hooks/useFetch';
// import MainLayout from '../layouts/MainLayout';
// import validateManyFields from '../validations';

// const Task = () => {

//   const authState = useSelector(state => state.authReducer);
//   const navigate = useNavigate();
//   const [fetchData, { loading }] = useFetch();
//   const { taskId } = useParams();

//   const mode = taskId === undefined ? "add" : "update";
//   const [task, setTask] = useState(null);
//   const [formData, setFormData] = useState({
//     description: ""
//   });
//   const [formErrors, setFormErrors] = useState({});


//   useEffect(() => {
//     document.title = mode === "add" ? "Add task" : "Update Task";
//   }, [mode]);


//   useEffect(() => {
//     if (mode === "update") {
//       const config = { url: `/tasks/${taskId}`, method: "get", headers: { Authorization: authState.token } };
//       fetchData(config, { showSuccessToast: false }).then((data) => {
//         setTask(data.task);
//         setFormData({ description: data.task.description });
//       });
//     }
//   }, [mode, authState, taskId, fetchData]);



//   const handleChange = e => {
//     setFormData({
//       ...formData, [e.target.name]: e.target.value
//     });
//   }

//   const handleReset = e => {
//     e.preventDefault();
//     setFormData({
//       description: task.description
//     });
//   }

//   const handleSubmit = e => {
//     e.preventDefault();
//     const errors = validateManyFields("task", formData);
//     setFormErrors({});

//     if (errors.length > 0) {
//       setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
//       return;
//     }

//     if (mode === "add") {
//       const config = { url: "/tasks", method: "post", data: formData, headers: { Authorization: authState.token } };
//       fetchData(config).then(() => {
//         navigate("/");
//       });
//     }
//     else {
//       const config = { url: `/tasks/${taskId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
//       fetchData(config).then(() => {
//         navigate("/");
//       });
//     }
//   }


//   const fieldError = (field) => (
//     <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
//       <i className='mr-2 fa-solid fa-circle-exclamation'></i>
//       {formErrors[field]}
//     </p>
//   )

//   return (
//     <>
//       <MainLayout>
//         <form className='m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md'>
//           {loading ? (
//             <Loader />
//           ) : (
//             <>
//               <h2 className='text-center mb-4'>{mode === "add" ? "Add New Task" : "Edit Task"}</h2>
//               <div className="mb-4">
//                 <label htmlFor="description">Description</label>
//                 <Textarea type="description" name="description" id="description" value={formData.description} placeholder="Write here.." onChange={handleChange} />
//                 {fieldError("description")}
//               </div>

//               <button className='bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>{mode === "add" ? "Add task" : "Update Task"}</button>
//               <button className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate("/")}>Cancel</button>
//               {mode === "update" && <button className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>Reset</button>}
//             </>
//           )}
//         </form>
//       </MainLayout>
//     </>
//   )
// }

// export default Task










import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useFetch from '../hooks/useFetch';
import Loader from '../components/utils/Loader';
import Pagination from '../components/utils/Pagination';
import TaskCard from '../components/TaskCard';
 // we'll create this

const Task = () => {
  const { token } = useSelector(state => state.authReducer);
  const [fetchData, { loading }] = useFetch();

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // tasks per page

  useEffect(() => {
    const config = {
      url: `/tasks?search=${search}&page=${page}&limit=${limit}`,
      method: "get",
      headers: { Authorization: token }
    };

    fetchData(config, { showSuccessToast: false }).then((data) => {
      setTasks(data.tasks);
      setTotalPages(data.totalPages || 1);
    });
  }, [search, page, fetchData, token]);

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page on new search
          }}
          className="p-2 border rounded-md w-full sm:w-80"
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <div className="grid gap-4">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          )}

          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
};

export default Task;

