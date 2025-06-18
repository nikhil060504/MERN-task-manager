import api from "../../api/index";
import { toast } from "react-hot-toast";

export const fetchTasks = () => async (dispatch) => {
  try {
    dispatch({ type: "FETCH_TASKS_START" });
    const { data } = await api.get("/tasks");

    if (!data.tasks) {
      throw new Error(data.msg || "Failed to fetch tasks");
    }

    dispatch({
      type: "FETCH_TASKS_SUCCESS",
      payload: data.tasks,
    });
    return data.tasks;
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg || error.message || "Failed to fetch tasks";
    dispatch({
      type: "FETCH_TASKS_ERROR",
      payload: errorMessage,
    });
    console.error("Error fetching tasks:", error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch({ type: "DELETE_TASK_START" });
    await api.delete(`/tasks/${id}`);
    dispatch({ type: "DELETE_TASK_SUCCESS", payload: id });
    toast.success("Task deleted successfully");
  } catch (error) {
    dispatch({
      type: "DELETE_TASK_ERROR",
      payload: error.response?.data?.message || error.message,
    });
    toast.error(error.response?.data?.message || error.message);
  }
};

export const updateTask = (id, taskData) => async (dispatch) => {
  try {
    console.log("[updateTask] Starting update:", { id, taskData });
    dispatch({ type: "UPDATE_TASK_START" });

    // Validate incoming data
    if (!id) {
      throw new Error("Task ID is required");
    }

    // Clean up taskData
    const cleanTaskData = Object.entries(taskData).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    console.log("[updateTask] Sending request:", {
      id,
      data: cleanTaskData,
      token: !!localStorage.getItem("token"),
    });

    const { data } = await api.put(`/tasks/${id}`, cleanTaskData);

    if (!data || (!data.task && !data.status)) {
      throw new Error(data?.msg || "Failed to update task");
    }

    const updatedTask = data.task || data;
    console.log("[updateTask] Success:", updatedTask);

    dispatch({ type: "UPDATE_TASK_SUCCESS", payload: updatedTask });
    toast.success(data.msg || "Task updated successfully");
    return updatedTask;
  } catch (error) {
    console.error("[updateTask] Error:", error.response || error);
    const errorMessage =
      error.response?.data?.msg || error.message || "Failed to update task";
    dispatch({
      type: "UPDATE_TASK_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
    throw error;
  }
};

export const addTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: "ADD_TASK_START" });
    const { data } = await api.post("/tasks", taskData);

    if (!data.task) {
      throw new Error(data.msg || "Failed to create task");
    }

    dispatch({ type: "ADD_TASK_SUCCESS", payload: data.task });
    toast.success(data.msg || "Task added successfully");
    return { type: "ADD_TASK_SUCCESS", payload: data.task };
  } catch (error) {
    const errorMessage =
      error.response?.data?.msg || error.message || "Failed to add task";
    dispatch({
      type: "ADD_TASK_ERROR",
      payload: errorMessage,
    });
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};
