import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Browse from "../pages/Browse";
import Details from "../pages/Details";
import Watch from "../pages/Watch";

import { useAuth } from "../hooks/useAuth";

// ✅ Protected Route Wrapper
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route
        path="/browse"
        element={
          <PrivateRoute>
            <Browse />
          </PrivateRoute>
        }
      />

      <Route
        path="/details/:id"
        element={
          <PrivateRoute>
            <Details />
          </PrivateRoute>
        }
      />

      <Route
        path="/watch/:id"
        element={
          <PrivateRoute>
            <Watch />
          </PrivateRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
