import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";

import { getMovieByIdApi, getStreamUrl } from "../api/movies.api";

export default function Watch() {
  const { id } = useParams();
  const videoRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD MOVIE =================
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMovieByIdApi(id);
        setMovie(data);

        // Restore time
        const saved = JSON.parse(localStorage.getItem("progress-" + id));
        if (saved && videoRef.current) {
          videoRef.current.currentTime = saved.time;
        }

      } catch (err) {
        setError("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  // ================= SAVE PROGRESS =================
  const saveProgress = () => {
    if (!videoRef.current || !movie) return;

    localStorage.setItem(
      "progress-" + id,
      JSON.stringify({
        time: videoRef.current.currentTime,
        movie,
      })
    );

    localStorage.setItem("lastWatched", JSON.stringify(movie));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-20">
          <Loader text="Loading player..." />
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-24 text-center">
          <p className="text-red-400">{error || "Movie not found"}</p>

          <Link
            to="/browse"
            className="mt-4 inline-block rounded bg-red-600 px-6 py-2"
          >
            Back to Browse
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-20">
        <div className="mx-auto max-w-6xl px-4">

          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">{movie.title}</h1>

            <Link
              to="/browse"
              className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Back
            </Link>
          </div>

          {/* Video Player */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-xl">
            <video
              ref={videoRef}
              controls
              autoPlay
              preload="auto"
              onTimeUpdate={saveProgress}
              onPause={saveProgress}
              onEnded={() => localStorage.removeItem("progress-" + id)}
              className="h-[70vh] w-full bg-black"
            >
              <source src={getStreamUrl(id)} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          </div>

          {/* Description */}
          <div className="mt-6 text-white/70">
            <p>{movie.description}</p>
          </div>

        </div>
      </main>
    </div>
  );
}
