import { createContext, useEffect, useState } from "react";
import { loginApi, profileApi, registerApi } from "../api/auth.api";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // ✅ Load user profile if token exists
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        localStorage.setItem("token", token);

        const profile = await profileApi();
        setUser(profile);
      } catch (error) {
        console.log("Profile error:", error?.response?.data || error.message);
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token]);

  // ✅ Register
  const register = async (data) => {
    const res = await registerApi(data);

    if (res?.token) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
    }

    return res;
  };

  // ✅ Login
  const login = async (data) => {
    const res = await loginApi(data);

    if (res?.token) {
      setToken(res.token);
      localStorage.setItem("token", res.token);
    }

    return res;
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    isLoggedIn: !!token,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
