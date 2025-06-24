import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import validateManyFields from "../validations";
import Input from "./utils/Input";
import { useDispatch, useSelector } from "react-redux";
import { postLoginData } from "../redux/actions/authActions";
import Loader from "./utils/Loader";

const LoginForm = ({ redirectUrl }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const { loading, isLoggedIn, errorMsg } = authState;

  // Handle navigation after successful login
  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectUrl || "/", { replace: true });
    }
  }, [isLoggedIn, navigate, redirectUrl]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear any existing errors when user types
    if (formErrors[e.target.name]) {
      setFormErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateManyFields("login", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(
        errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {})
      );
      return;
    }

    try {
      await dispatch(postLoginData(formData.email, formData.password));
    } catch (error) {
      // Error is already handled by the action
      console.error("Login failed:", error);
    }
  };

  const fieldError = (field) => (
    <p
      className={`mt-1 text-pink-600 text-sm ${
        formErrors[field] ? "block" : "hidden"
      }`}
    >
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[500px] bg-white p-8 border-2 shadow-md rounded-md"
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-center mb-4">
              Welcome user, please login here
            </h2>
            {errorMsg && (
              <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                {errorMsg}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Email
              </label>
              <Input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                placeholder="youremail@domain.com"
                onChange={handleChange}
              />
              {fieldError("email")}
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="after:content-['*'] after:ml-0.5 after:text-red-500"
              >
                Password
              </label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                placeholder="Your password.."
                onChange={handleChange}
              />
              {fieldError("password")}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark rounded"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="pt-4 text-center">
              <Link to="/signup" className="text-blue-400 hover:text-blue-600">
                Don't have an account? Signup here
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
