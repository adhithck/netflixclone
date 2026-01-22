// ✅ Backend base URL (from Vite env)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ API endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  MOVIES: `${API_BASE_URL}/api/movies`,
  STREAM: `${API_BASE_URL}/api/stream`,
  UPLOAD: `${API_BASE_URL}/api/upload`,
};

// ✅ App info
export const APP_NAME = "Netflix Clone";

// ✅ Movie genres (optional)
export const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Documentary",
];
