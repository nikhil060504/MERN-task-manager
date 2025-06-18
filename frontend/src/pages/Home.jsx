// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import Tasks from '../components/Tasks';
// import MainLayout from '../layouts/MainLayout';
// import StatsCards from '../components/StatsCards';
// const Home = () => {

//   const authState = useSelector(state => state.authReducer);
//   const { isLoggedIn } = authState;

//   useEffect(() => {
//     document.title = authState.isLoggedIn ? `${authState.user.name}'s tasks` : "Task Manager";
//   }, [authState]);



//   return (
//     <>
//       <MainLayout>
//         {!isLoggedIn ? (
//           <div className='bg-primary text-white h-[40vh] py-8 text-center'>
//             <h1 className='text-2xl'> Welcome to Task Manager App</h1>
//             <Link to="/signup" className='mt-10 text-xl block space-x-2 hover:space-x-4'>
//               <span className='transition-[margin]'>Join now to manage your tasks</span>
//               <span className='relative ml-4 text-base transition-[margin]'><i className="fa-solid fa-arrow-right"></i></span>
//             </Link>
//           </div>
//         ) : (
//           <>
//             <h1 className='text-lg mt-8 mx-8 border-b border-b-gray-300'>Welcome {authState.user.name}</h1>
//            <StatsCards/>
//             <Tasks />
//           </>
//         )}
//       </MainLayout>
//     </>
//   )
// }

// export default Home








import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';
import StatsCards from '../components/StatsCards';
import TaskCompletionGraph from '../components/TaskCompletionGraph';

const Home = () => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn, token, user } = authState;

  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    document.title = isLoggedIn ? `${user.name}'s tasks` : 'Task Manager';

    const fetchGraphData = async () => {
      try {
        const res = await axios.get('/api/tasks/completion-graph', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGraphData(res.data);
      } catch (err) {
        console.error('Failed to load graph data:', err);
      }
    };

    if (isLoggedIn) fetchGraphData();
  }, [isLoggedIn, token, user.name]);

  return (
    <MainLayout>
      {!isLoggedIn ? (
        <div className="bg-primary text-white h-[40vh] py-8 text-center">
          <h1 className="text-3xl font-semibold">Welcome to Task Manager App</h1>
          <Link to="/signup" className="mt-10 text-xl inline-block hover:underline">
            Join now to manage your tasks <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
        </div>
      ) : (
        <div className="space-y-8 px-4 md:px-8">
          <h1 className="text-2xl font-semibold mt-6">👋 Welcome, {user.name}</h1>

          {/* Weekly Graph Section */}
          <section>
            <h2 className="text-xl font-medium mb-2">📈 Weekly Task Completion</h2>
            <div className="bg-white shadow-md rounded-lg p-4">
              <TaskCompletionGraph data={graphData} />
            </div>
          </section>

          {/* Stats Cards Section */}
          <section>
            <StatsCards />
          </section>

          {/* Task List Section */}
          <section>
            <h2 className="text-xl font-medium mb-2">📋 Your Tasks</h2>
            <Tasks />
          </section>
        </div>
      )}
    </MainLayout>
  );
};

export default Home;
