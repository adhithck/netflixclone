import { useEffect, useState } from "react";
import { getAllMoviesApi, searchMoviesApi } from "../api/movies.api";

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [error, setError] = useState("");

  const getMovies = async () => {
    try {
      setError("");
      setLoadingMovies(true);

      const data = await getAllMoviesApi();
      setMovies(data?.movies || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load movies");
    } finally {
      setLoadingMovies(false);
    }
  };

  const searchMovies = async (query) => {
    try {
      setError("");
      setLoadingMovies(true);

      const data = await searchMoviesApi(query);
      setMovies(data?.movies || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Search failed");
    } finally {
      setLoadingMovies(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  return {
    movies,
    loadingMovies,
    error,
    getMovies,
    searchMovies,
  };
};
