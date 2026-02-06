import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";
import { useAuth } from "../hooks/useAuth";

import { getMovieByIdApi, getStreamUrl } from "../api/movies.api";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPremium, upgradeToPremium } = useAuth(); // ⭐ razorpay hook

  const videoRef = useRef(null);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= RAZORPAY =================
  const subscribePremium = () => {
    const options = {
      key: "RAZORPAY_KEY_ID", // 🔴 PUT YOUR KEY
      amount: 19900,
      currency: "INR",
      name: "Netflix Clone",
      description: "Premium Subscription",
      handler: function () {
        upgradeToPremium(); // local upgrade
        alert("Premium Activated ✅");
      },
      theme: { color: "#e50914" },
    };

    const rz = new window.Razorpay(options);
    rz.open();
  };

  // ================= LOAD MOVIE =================
  useEffect(() => {
    if (!isPremium) return;

    const loadMovie = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMovieByIdApi(id);
        setMovie(data);

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
  }, [id, isPremium]);

  const saveProgress = () => {
    if (!videoRef.current || !movie) return;

    localStorage.setItem(
      "progress-" + id,
      JSON.stringify({
        time: videoRef.current.currentTime,
        movie,
      }),
    );

    localStorage.setItem("lastWatched", JSON.stringify(movie));
  };

  // ================= PREMIUM WALL =================
  if (!isPremium) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />

        <main className="pt-32 text-center">
          <h2 className="text-2xl font-bold text-yellow-400">
            Premium Required 🔒
          </h2>

          <p className="mt-2 text-white/60">
            Subscribe to watch this movie.
          </p>

          <button
            onClick={subscribePremium}
            className="mt-6 rounded bg-red-600 px-8 py-3 font-semibold hover:bg-red-700"
          >
            💳 Upgrade ₹199
          </button>

          <div>
            <Link
              to="/browse"
              className="mt-6 inline-block text-sm text-white/60"
            >
              Back to Browse
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">{movie.title}</h1>

            <button
              onClick={() => navigate(-1)}
              className="rounded bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Back
            </button>
          </div>

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
            </video>
          </div>

          <div className="mt-6 text-white/70">
            <p>{movie.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
