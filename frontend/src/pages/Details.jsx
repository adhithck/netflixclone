import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loader from "../components/ui/Loader";

import {
  getMovieByIdApi,
  getAllMoviesApi,
  getThumbnailUrl,
  getStreamUrl,
} from "../api/movies.api";

export default function Details() {
  const { id } = useParams();
  const videoRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD MOVIE + OTHERS =================
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const m = await getMovieByIdApi(id);
      const all = await getAllMoviesApi();

      setMovie(m);
      setOthers((all.movies || []).filter((x) => x._id !== id));

      setLoading(false);
    };

    load();
  }, [id]);

  // ================= LOOP FIRST 10s =================
  useEffect(() => {
    if (!videoRef.current) return;

    const v = videoRef.current;

    const loop = () => {
      if (v.currentTime >= 10) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    };

    v.addEventListener("timeupdate", loop);

    return () => v.removeEventListener("timeupdate", loop);
  }, [movie]);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-24">
          <Loader text="Loading..." />
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16">

        {/* HERO TRAILER */}
        <div className="relative h-[60vh]">

          <video
            ref={videoRef}
            src={getStreamUrl(movie._id)}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
            <h1 className="text-4xl font-bold">{movie.title}</h1>

            <div className="mt-4 flex gap-3">
              <Link
                to={`/watch/${movie._id}`}
                className="rounded bg-white px-6 py-2 text-black font-semibold"
              >
                ▶ Play Full
              </Link>

              <Link
                to="/browse"
                className="rounded bg-white/10 px-6 py-2"
              >
                Back
              </Link>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="mx-auto max-w-7xl px-6 py-10 text-white/70">
          <p>{movie.description}</p>

          <div className="mt-3 text-sm space-y-1">
            <p>Genre: {movie.genre}</p>
            <p>Year: {movie.year}</p>
            <p>Duration: {movie.duration}</p>
          </div>
        </div>

        {/* OTHER MOVIES */}
        <div className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="mb-4 text-xl font-semibold">More Like This</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {others.map((m) => (
              <Link
                key={m._id}
                to={`/details/${m._id}`}
                className="group overflow-hidden rounded-lg"
              >
                <img
                  src={getThumbnailUrl(m.thumbnailUrl)}
                  className="aspect-[2/3] w-full object-cover transition group-hover:scale-105"
                />

                <div className="p-2 text-sm font-semibold bg-black/70">
                  {m.title}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
