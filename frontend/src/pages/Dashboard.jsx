import React from "react";
import { useSelector } from "react-redux";
import useTaskStats from "../hooks/useTaskStats";

const Dashboard = () => {
  const { token } = useSelector((state) => state.authReducer);
  const { stats, loading } = useTaskStats(token);

  if (loading) return <div className="p-4">Loading stats...</div>;
  if (!stats) return <div className="p-4 text-red-500">Failed to load stats</div>;

  const { totalTasks, statusCount, categoryCount, priorityCount } = stats;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📊 Task Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Tasks" count={totalTasks} />
        <StatCard title="Status" data={statusCount} />
        <StatCard title="Category" data={categoryCount} />
        <StatCard title="Priority" data={priorityCount} />
      </div>
    </div>
  );
};

const StatCard = ({ title, data, count }) => (
  <div className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {count !== undefined ? (
      <div className="text-3xl font-bold">{count}</div>
    ) : (
      <ul className="text-sm space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <li key={key}>
            <span className="capitalize">{key}</span>: <strong>{value}</strong>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Dashboard;
