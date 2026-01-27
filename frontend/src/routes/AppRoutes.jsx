import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Browse from "../pages/Browse";
import Details from "../pages/Details";
import Watch from "../pages/Watch";
import Admin from "../pages/Admin";

import { useAuth } from "../hooks/useAuth";

// ================= USER PROTECTED =================
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <div className="text-white">Loading...</div>;

  return isLoggedIn ? children : <Navigate to="/" replace />;
}

// ================= PUBLIC ONLY =================
function PublicRoute({ children }) {
  const { isLoggedIn, user } = useAuth();

  if (isLoggedIn) {
    if (user?.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to="/browse" replace />;
  }

  return children;
}

// ================= ADMIN ONLY =================
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-white">Loading...</div>;

  if (!user || !user.isAdmin) return <Navigate to="/" replace />;

  return children;
}

// ================= ROUTES =================
export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
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
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* USER */}
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

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
