import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Browse from "../pages/Browse";
import Details from "../pages/Details";
import Watch from "../pages/Watch";
import Admin from "../pages/Admin";

import { useAuth } from "../hooks/useAuth";

// Normal Protected
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

// Admin Protected
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/browse" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User */}
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

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
