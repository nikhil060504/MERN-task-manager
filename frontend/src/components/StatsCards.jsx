// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const StatsCards = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('/api/tasks/stats', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setStats(res.data);
//       } catch (err) {
//         console.error('Failed to fetch stats:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   if (loading) {
//     return <p className="text-center text-gray-500 mt-4">Loading stats...</p>;
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
//         <h2 className="text-sm text-gray-500 dark:text-gray-300">Total</h2>
//         <p className="text-xl font-bold">{stats.total}</p>
//       </div>
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
//         <h2 className="text-sm text-gray-500 dark:text-gray-300">Completed</h2>
//         <p className="text-xl font-bold text-green-500">{stats.completed}</p>
//       </div>
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
//         <h2 className="text-sm text-gray-500 dark:text-gray-300">Pending</h2>
//         <p className="text-xl font-bold text-yellow-500">{stats.pending}</p>
//       </div>
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
//         <h2 className="text-sm text-gray-500 dark:text-gray-300">Recurring</h2>
//         <p className="text-xl font-bold text-blue-500">{stats.recurring}</p>
//       </div>
//     </div>
//   );
// };

// export default StatsCards;



import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/tasks/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Loading stats...</p>;
  }

  // If stats is null or undefined (failed fetch), show 0 for all
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const pending = stats?.pending ?? 0;
  const recurring = stats?.recurring ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
        <h2 className="text-sm text-gray-500 dark:text-gray-300">Total</h2>
        <p className="text-xl font-bold">{total}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
        <h2 className="text-sm text-gray-500 dark:text-gray-300">Completed</h2>
        <p className="text-xl font-bold text-green-500">{completed}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
        <h2 className="text-sm text-gray-500 dark:text-gray-300">Pending</h2>
        <p className="text-xl font-bold text-yellow-500">{pending}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center">
        <h2 className="text-sm text-gray-500 dark:text-gray-300">Recurring</h2>
        <p className="text-xl font-bold text-blue-500">{recurring}</p>
      </div>
    </div>
  );
};

export default StatsCards;
