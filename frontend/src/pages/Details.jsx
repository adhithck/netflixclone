import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loader from "../components/ui/Loader";
import { getMovieByIdApi } from "../api/movies.api";
import { getThumbnailUrl } from "../api/movies.api";

export default function Details() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        setLoading(true);

        const data = await getMovieByIdApi(id);
        setMovie(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load movie");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16">
        {loading && <Loader text="Loading movie..." />}

        {error && (
          <div className="mx-auto max-w-4xl px-4 py-10 text-red-400">
            {error}
          </div>
        )}

        {movie && (
          <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img
                src={getThumbnailUrl(movie.thumbnailUrl)}
                alt={movie.title}
                className="h-[420px] w-full object-cover"
              />

              <div className="p-6">
                <h1 className="text-3xl font-bold">{movie.title}</h1>
                <p className="mt-3 text-white/70">{movie.description}</p>

                <div className="mt-4 text-sm text-white/60">
                  <p>Genre: {movie.genre || "Unknown"}</p>
                  <p>Year: {movie.year || "-"}</p>
                  <p>Duration: {movie.duration || "-"}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/watch/${movie._id}`}
                    className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
                  >
                    ▶ Play
                  </Link>

                  <Link
                    to="/browse"
                    className="rounded-lg bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
