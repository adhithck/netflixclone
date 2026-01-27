import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";

import {
  getAllMoviesApi,
  getThumbnailUrl,
  searchMoviesApi,
} from "../api/movies.api.js";

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllMoviesApi();
      setMovies(data.movies || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search handler
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) return loadMovies();

    try {
      const data = await searchMoviesApi(value);
      setMovies(data.movies || []);
    } catch {
      setMovies([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20">
        {/* ✅ Search bar */}
        <div className="mx-auto max-w-7xl px-4 mb-6">
          <input
            value={query}
            onChange={handleSearch}
            placeholder="Search movies..."
            className="w-full rounded-lg bg-white/10 px-4 py-3 outline-none placeholder:text-white/50 focus:bg-white/15"
          />
        </div>

        {/* Loader */}
        {loading && <Loader text="Loading movies..." />}

        {/* Error */}
        {error && (
          <div className="mx-auto max-w-7xl px-6 py-6 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && movies.length === 0 && (
          <div className="mx-auto max-w-7xl px-6 py-10 text-white/60">
            No movies found.
          </div>
        )}

        {/* Movies */}
        {!loading && movies.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 pb-20">
            <h2 className="mb-4 px-2 text-xl font-semibold">
              Trending Now
            </h2>

            <div
              className="
                grid gap-4
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
              "
            >
              {movies.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/details/${movie._id}`}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <div className="relative aspect-[2/3] w-full bg-black">
                    <img
                      src={getThumbnailUrl(movie.thumbnailUrl)}
                      alt={movie.title}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition" />

                  <div className="pointer-events-none absolute bottom-0 w-full translate-y-full p-3 text-sm font-semibold transition group-hover:translate-y-0">
                    {movie.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
