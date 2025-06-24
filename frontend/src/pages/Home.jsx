import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import AdvancedCalendar from "../components/AdvancedCalendar";
import Tasks from "../components/Tasks";
import MainLayout from "../layouts/MainLayout";
import StatsCards from "../components/StatsCards";
import TaskCompletionGraph from "../components/TaskCompletionGraph";
import { FaCalendarAlt, FaChartBar } from "react-icons/fa";

const Home = () => {
  const authState = useSelector((state) => state.auth) || {
    isLoggedIn: false,
    token: null,
    user: null,
  };
  const { isLoggedIn, token, user } = authState;

  const [graphData, setGraphData] = useState([]);
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  useEffect(() => {
    document.title =
      isLoggedIn && user ? `${user.name}'s tasks` : "Task Manager";
    const fetchGraphData = async () => {
      try {
        const res = await axios.get("/api/tasks/completion-graph", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGraphData(res.data);
      } catch (err) {
        console.error("Failed to load graph data:", err);
      }
    };
    if (isLoggedIn && token) fetchGraphData();
  }, [isLoggedIn, token, user]);

  // Add this effect to refresh the graph when statsRefreshKey changes
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const res = await axios.get("/api/tasks/completion-graph", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGraphData(res.data);
      } catch (err) {
        console.error("Failed to load graph data:", err);
      }
    };
    if (isLoggedIn && token) fetchGraphData();
  }, [statsRefreshKey, isLoggedIn, token]);

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen pt-8 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            👋 Welcome, {user?.name || "User"}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Calendar Card */}
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center w-full min-h-[420px]">
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-500 text-2xl mr-2" />
                <h2 className="text-lg font-semibold text-gray-700">
                  Calendar
                </h2>
              </div>
              <div className="w-full max-w-lg">
                <AdvancedCalendar />
              </div>
            </div>
            {/* Graph Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col w-full min-h-[420px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaChartBar className="text-green-500 text-2xl mr-2" />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Weekly Task Completion
                  </h2>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last 7 days
                </div>
              </div>
              <div className="flex-1 w-full">
                <TaskCompletionGraph data={graphData} />
              </div>
            </div>
          </div>
          {/* Stats and Tasks */}
          <div className="mt-10">
            <StatsCards statsRefreshKey={statsRefreshKey} />
            <section className="mt-8">
              <h2 className="text-xl font-medium mb-4">📋 Your Tasks</h2>
              <Tasks onTaskChange={() => setStatsRefreshKey((k) => k + 1)} />
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
