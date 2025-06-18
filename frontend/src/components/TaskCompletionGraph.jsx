// src/components/TaskCompletionGraph.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow text-sm border border-gray-200">
        <div>
          <strong>Date:</strong> {label}
        </div>
        <div>
          <strong>Completed Tasks:</strong> {payload[0].value}
        </div>
      </div>
    );
  }
  return null;
};

const TaskCompletionGraph = ({ data = []}) => {
  // Colors for bars
  const normalColor = "#3B82F6"; // blue-500
  const todayColor = "#2563EB"; // blue-600
  const hoverColor = "#1D4ED8"; // blue-700

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={Array.isArray(data) ? data:[]}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "currentColor" }}
              className="text-sm"
            >
              <Label
                value="Date"
                offset={-10}
                position="insideBottom"
                className="fill-current"
              />
            </XAxis>
            <YAxis
              allowDecimals={false}
              tick={{ fill: "currentColor" }}
              className="text-sm"
            >
              <Label
                value="Completed Tasks"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
                className="fill-current"
              />
            </YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Bar
              dataKey="completed"
              name="Completed Tasks"
              radius={[6, 6, 0, 0]}
            >
              { Array.isArray(data) &&
              data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? todayColor : normalColor}
                  className="hover:fill-blue-700 transition-colors"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No task completion data available
        </div>
      )}
    </div>
  );
};

export default TaskCompletionGraph;
