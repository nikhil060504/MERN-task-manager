import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SAVE_PROFILE,
} from "../actions/actionTypes";

const initialState = {
  loading: false,
  user: null,
  isLoggedIn: false,
  token: localStorage.getItem("token") || "",
  successMsg: "",
  errorMsg: "",
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        errorMsg: "",
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isLoggedIn: true,
        token: action.payload.token,
        successMsg: action.payload.msg,
        errorMsg: "",
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        isLoggedIn: false,
        token: "",
        successMsg: "",
        errorMsg: action.payload.msg,
      };
    case LOGOUT:
      return {
        ...initialState,
        token: "",
      };
    case SAVE_PROFILE:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        isLoggedIn: true,
        token: action.payload.token,
        successMsg: "",
        errorMsg: "",
      };
    default:
      return state;
  }
};

export default authReducer;
