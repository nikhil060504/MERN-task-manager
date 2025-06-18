import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authActions";
import { FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const user = authState?.user;

  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between w-full transition-colors duration-200">
      <span className="text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight select-none">
        Task Manager
      </span>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
