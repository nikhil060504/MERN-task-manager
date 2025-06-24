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

const TaskCompletionGraph = ({ data = [] }) => {
  // Colors for bars
  const normalColor = "#3B82F6"; // blue-500
  const todayColor = "#2563EB"; // blue-600

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="completed">
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.isToday ? todayColor : normalColor}
                />
              ))}
              {/* Show numbers above bars */}
              {data.map((entry, idx) => (
                <text
                  key={`label-${idx}`}
                  x={idx * 60 + 30}
                  y={250 - entry.completed * 10}
                  textAnchor="middle"
                  fill="#111827"
                  fontSize={14}
                  fontWeight={entry.isToday ? 700 : 400}
                >
                  {entry.completed}
                </text>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TaskCompletionGraph;
