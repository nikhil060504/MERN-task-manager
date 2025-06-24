import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { motion } from "framer-motion";
<<<<<<< HEAD

=======
import api from "../api/index";
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom event component with animations
const CustomEvent = ({ event }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
    className={`p-1 rounded text-sm font-medium ${
      event.isHoliday
        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400"
        : "bg-blue-100 text-blue-800"
    }`}
  >
    {event.title}
  </motion.div>
);

const AdvancedCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        // Fetch tasks and holidays/festivals
        const [tasksRes, holidaysRes] = await Promise.all([
          axios.get("/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/tasks/events", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const taskEvents = (tasksRes.data.tasks || []).map((task) => ({
          title: task.title,
          start: new Date(task.dueDate),
          end: new Date(task.dueDate),
          allDay: false,
          resource: task,
          className: "task-event",
        }));
        const holidayEvents = (holidaysRes.data.events || []).map((event) => ({
          title: event.name || event.title,
          start: new Date(event.date || event.start),
          end: new Date(event.date || event.start),
          allDay: true,
          isHoliday: true,
          className: "holiday-event",
        }));
        setEvents([...taskEvents, ...holidayEvents]);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Fallback to just tasks if holidays fail
        try {
          const token = localStorage.getItem("token");
<<<<<<< HEAD
          const tasksRes = await axios.get("/api/tasks", {
=======
          const tasksRes = await api.get("/api/tasks", {
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d
            headers: { Authorization: `Bearer ${token}` },
          });
          const taskEvents = (tasksRes.data.tasks || []).map((task) => ({
            title: task.title,
            start: new Date(task.dueDate),
            end: new Date(task.dueDate),
            allDay: false,
            resource: task,
            className: "task-event",
          }));
          setEvents(taskEvents);
        } catch (e) {
          setEvents([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-8"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200"
      >
        Calendar View
      </motion.h2>
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-[400px]"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="calendar-container"
        >
          <style>
            {`
              .calendar-container {
                height: 600px;
                transition: all 0.3s ease;
              }
              .calendar-container:hover {
                transform: scale(1.01);
              }
              .rbc-event {
                transition: all 0.2s ease;
                border: none !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .rbc-event:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.15);
              }
              .rbc-today {
                background-color: rgba(59, 130, 246, 0.1) !important;
              }
              .rbc-header {
                padding: 10px !important;
                font-weight: 600 !important;
                transition: background-color 0.2s ease;
              }
              .rbc-header:hover {
                background-color: rgba(59, 130, 246, 0.1);
              }
              .rbc-button-link {
                transition: all 0.2s ease;
              }
              .rbc-button-link:hover {
                color: #3b82f6;
                transform: scale(1.1);
              }
              .task-event {
                background-color: #3b82f6 !important;
                color: white !important;
              }
              .holiday-event {
                background-color: #fbbf24 !important;
                color: #92400e !important;
                border: 2px solid #d97706 !important;
              }
              .dark .rbc-toolbar button {
                color: #e5e7eb !important;
                border-color: #4b5563 !important;
              }
              .dark .rbc-toolbar button:hover {
                background-color: #374151 !important;
              }
              .dark .rbc-toolbar button.rbc-active {
                background-color: #3b82f6 !important;
                color: white !important;
              }
              .dark .rbc-month-view {
                border-color: #4b5563 !important;
              }
              .dark .rbc-header {
                border-color: #4b5563 !important;
                color: #e5e7eb !important;
              }
              .dark .rbc-off-range-bg {
                background-color: #1f2937 !important;
              }
              .dark .rbc-today {
                background-color: rgba(59, 130, 246, 0.2) !important;
              }
            `}
          </style>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            components={{
              event: CustomEvent,
            }}
            eventPropGetter={(event) => ({
              className: event.className,
            })}
            popup
            selectable
            views={["month", "week", "day"]}
            defaultView="month"
            tooltipAccessor={(event) =>
              event.isHoliday
                ? `Holiday: ${event.title}`
                : `Task: ${event.title}`
            }
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdvancedCalendar;
