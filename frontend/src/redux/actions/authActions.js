import api from "../../api";
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SAVE_PROFILE,
} from "./actionTypes";
import { toast } from "react-toastify";

export const postLoginData = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const { data } = await api.post("/auth/login", { email, password });

    // Log the login response for debugging
    console.log("[FRONTEND LOGIN] Response:", data);

    if (!data.token) {
      throw new Error("No token received from server");
    }

    // Store token in localStorage
    localStorage.setItem("token", data.token);
<<<<<<< HEAD
    // Debug: log the token value after saving
    console.log(
      "[FRONTEND LOGIN] Token saved to localStorage:",
      localStorage.getItem("token")
    );
=======
>>>>>>> bafbc4df1e11bab2a9e39d4807b61aaeb7b2a30d

    // Dispatch success action with all necessary data
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        user: data.user,
        token: data.token,
        msg: data.msg || "Login successful",
      },
    });

    toast.success(data.msg || "Login successful");
    return data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error);
    const msg = error.response?.data?.msg || error.message;
    dispatch({
      type: LOGIN_FAILURE,
      payload: { msg },
    });
    toast.error(msg);
    throw error;
  }
};

export const saveProfile = (token) => async (dispatch) => {
  if (!token) {
    console.error("No token provided for profile fetch");
    return;
  }

  try {
    const response = await api.get("/profile");
    const userData = response.data;

    if (!userData) {
      throw new Error("No user data received");
    }

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        token,
        user: userData,
        msg: "Profile loaded successfully",
      },
    });
  } catch (error) {
    console.error("Profile fetch failed:", error.message);
    // Clear invalid token
    localStorage.removeItem("token");
    dispatch({
      type: "LOGOUT",
      payload: { msg: "Session expired. Please login again." },
    });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
  // Use navigate from component instead of window.location
};
