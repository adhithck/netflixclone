import axiosInstance from "./axios";

// ✅ Register
export const registerApi = async (data) => {
  const res = await axiosInstance.post("/api/auth/register", data);
  return res.data;
};

// ✅ Login
export const loginApi = async (data) => {
  const res = await axiosInstance.post("/api/auth/login", data);
  return res.data;
};

// ✅ Profile
export const profileApi = async () => {
  const res = await axiosInstance.get("/api/auth/profile");
  return res.data;
};
