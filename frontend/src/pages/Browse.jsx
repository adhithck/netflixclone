import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";

import { getAllMoviesApi, getThumbnailUrl } from "../api/movies.api.js";

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setError("");
        setLoading(true);

        const data = await getAllMoviesApi();
        setMovies(data.movies || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16">
        {loading && <Loader text="Loading movies..." />}

        {error && (
          <div className="mx-auto max-w-6xl px-4 py-6 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="mx-auto max-w-6xl px-4 py-10 text-white/70">
            No movies found. Upload movies from Postman first.
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Browse Movies</h1>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {movies.map((movie) => (
                <Link
                  key={movie._id}
                  to={`/details/${movie._id}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                >
                  <img
                    src={getThumbnailUrl(movie.thumbnailUrl)}
                    alt={movie.title}
                    className="h-64 w-full object-cover transition group-hover:scale-105"
                  />

                  <div className="p-4">
                    <h2 className="font-semibold line-clamp-1">
                      {movie.title}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {movie.genre || "Unknown"} • {movie.year || "-"}
                    </p>
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
