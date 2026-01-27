import axiosInstance from "./axios";

// ================= USER =================

// Get all movies
export const getAllMoviesApi = async () => {
  const res = await axiosInstance.get("/api/movies");
  return res.data;
};

// Get single movie
export const getMovieByIdApi = async (id) => {
  const res = await axiosInstance.get(`/api/movies/${id}`);
  return res.data;
};

// Search movies
export const searchMoviesApi = async (query) => {
  const res = await axiosInstance.get(`/api/movies/search?q=${query}`);
  return res.data;
};

// Stream helper
export const getStreamUrl = (movieId) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}/api/stream/${movieId}`;
};

// Thumbnail helper
export const getThumbnailUrl = (thumbnailUrl) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return thumbnailUrl?.startsWith("http")
    ? thumbnailUrl
    : `${baseUrl}/${thumbnailUrl}`;
};

// ================= ADMIN =================

// Upload movie
export const uploadMovieApi = async (formData) => {
  const res = await axiosInstance.post("/api/movies", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Delete movie
export const deleteMovieApi = async (id) => {
  const res = await axiosInstance.delete(`/api/movies/${id}`);
  return res.data;
};

// Get all movies (admin)
export const adminGetMoviesApi = async () => {
  const res = await axiosInstance.get("/api/movies");
  return res.data.movies; // ✅ return ARRAY directly
};
