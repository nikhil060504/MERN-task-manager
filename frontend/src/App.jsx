import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { saveProfile } from "./redux/actions/authActions";
import { LOGOUT } from "./redux/actions/actionTypes";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Separate component for protected routes to prevent unnecessary re-renders
const ProtectedRoute = ({ children }) => {
  const authState = useSelector((state) => state.auth);
  const location = useLocation();

  const isAuthenticated = useMemo(() => {
    return authState.isLoggedIn && authState.user;
  }, [authState.isLoggedIn, authState.user]);

  // Optionally, add loading state here in the future
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Separate component for public routes
const PublicRoute = ({ children }) => {
  const authState = useSelector((state) => state.auth);
  const location = useLocation();

  const isAuthenticated = useMemo(() => {
    return authState.isLoggedIn && authState.user;
  }, [authState.isLoggedIn, authState.user]);

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const token = authState?.token;

  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        dispatch({ type: LOGOUT });
        localStorage.removeItem("token");
      } else {
        dispatch(saveProfile(token));
      }
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
