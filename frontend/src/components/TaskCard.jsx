import React from 'react';

const TaskCard = ({ task }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h3 className="text-lg font-semibold">{task.description}</h3>
      <p className="text-sm text-gray-600">Status: {task.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
};

export default TaskCard;
