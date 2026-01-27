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

      <main className="pt-20">
        {loading && <Loader text="Loading movies..." />}

        {error && (
          <div className="mx-auto max-w-7xl px-6 py-6 text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="mx-auto max-w-7xl px-6 py-10 text-white/60">
            No movies uploaded yet.
          </div>
        )}

        {!loading && movies.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 pb-16">
            {/* Netflix style row */}
            <div className="mb-4 px-2 text-lg font-semibold">
              Trending Now
            </div>

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
                  {/* Thumbnail */}
                  <img
                    src={getThumbnailUrl(movie.thumbnailUrl)}
                    alt={movie.title}
                    className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition" />

                  {/* Title on hover */}
                  <div className="absolute bottom-0 w-full translate-y-full p-3 text-sm font-semibold transition group-hover:translate-y-0">
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
