import axiosInstance from "./axios";

// ✅ Get all movies
export const getAllMoviesApi = async () => {
  const res = await axiosInstance.get("/api/movies");
  return res.data;
};

// ✅ Get single movie by id
export const getMovieByIdApi = async (id) => {
  const res = await axiosInstance.get(`/api/movies/${id}`);
  return res.data;
};

// ✅ Search movies
export const searchMoviesApi = async (query) => {
  const res = await axiosInstance.get(`/api/movies/search?q=${query}`);
  return res.data;
};

// ✅ Stream url helper
export const getStreamUrl = (movieId) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return `${baseUrl}/api/stream/${movieId}`;
};

// ✅ Thumbnail helper
export const getThumbnailUrl = (thumbnailUrl) => {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  return thumbnailUrl?.startsWith("http")
    ? thumbnailUrl
    : `${baseUrl}/${thumbnailUrl}`;
};
