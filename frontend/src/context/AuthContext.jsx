import { createContext, useEffect, useState } from "react";
import { loginApi, profileApi, registerApi } from "../api/auth.api.js";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  // ⭐ Premium with expiry
  const isPremium =
    user?.premiumUntil && new Date(user.premiumUntil) > new Date();

  // ✅ Load user profile if token exists
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const profile = await profileApi();

        setUser(profile);
      } catch (error) {
        console.log("Profile error:", error?.response?.data || error.message);
        setUser(null);
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
      localStorage.setItem("token", res.token);
      setToken(res.token);

      if (res.user) setUser(res.user);
    }

    return res;
  };

  // ✅ Login
  const login = async (data) => {
    const res = await loginApi(data);

    if (res?.token) {
      localStorage.setItem("token", res.token);
      setToken(res.token);

      if (res.user) setUser(res.user);
    }

    return res;
  };

  // ⭐ TEMP helper (kept)
  const upgradeToPremium = () => {
    setUser((u) => ({
      ...u,
      premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }));
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!token,
        isPremium,
        register,
        login,
        logout,
        upgradeToPremium,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
