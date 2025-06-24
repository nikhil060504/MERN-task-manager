const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TASKS_START":
    case "DELETE_TASK_START":
    case "UPDATE_TASK_START":
    case "ADD_TASK_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_TASKS_SUCCESS":
      return {
        ...state,
        tasks: action.payload,
        loading: false,
        error: null,
      };
    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        loading: false,
        error: null,
      };
    case "UPDATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false,
        error: null,
      };
    case "ADD_TASK_SUCCESS":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
        error: null,
      };
    case "FETCH_TASKS_ERROR":
    case "DELETE_TASK_ERROR":
    case "UPDATE_TASK_ERROR":
    case "ADD_TASK_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default taskReducer;
 