import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaCheck } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";

import { getFavoritesApi, toggleFavoriteApi } from "../api/favorites.api";
import {
  getAllMoviesApi,
  getThumbnailUrl,
  getStreamUrl,
} from "../api/movies.api";

export default function Browse() {
  const heroRef = useRef(null);
  const location = useLocation();
  const { isPremium, upgradeToPremium } = useAuth();

  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [myList, setMyList] = useState([]);
  const [hero, setHero] = useState(null);

  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  const query = new URLSearchParams(location.search).get("q") || "";
  const isSearching = query.trim().length > 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMovies();
    loadContinue();
    loadMyList();
  }, []);

  const loadMovies = async () => {
    setLoading(true);

    const data = await getAllMoviesApi();
    const list = data.movies || [];

    const visible = isPremium ? list : list.filter((m) => !m.premiumOnly);

    setMovies(visible);
    setAllMovies(visible);

    const last = localStorage.getItem("lastWatched");
    setHero(last ? JSON.parse(last) : visible[0]);

    setLoading(false);
  };

  const loadContinue = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("progress-")
    );

    const list = keys
      .map((k) => JSON.parse(localStorage.getItem(k)))
      .filter(Boolean)
      .map((x) => x.movie);

    setContinueWatching(list);
  };

  const loadMyList = async () => {
    const favs = await getFavoritesApi();
    setMyList(favs || []);
  };

  const toggleMyList = async (movie) => {
    const updated = await toggleFavoriteApi(movie._id);
    setMyList(updated);
  };

  useEffect(() => {
    if (!query) {
      setMovies(allMovies);
      return;
    }

    const filtered = allMovies.filter((m) =>
      m.title?.toLowerCase().includes(query.toLowerCase())
    );

    setMovies(filtered);
  }, [query, allMovies]);

  const premiereMovies =
    movies.filter((m) => m.isPremiere).length > 0
      ? movies.filter((m) => m.isPremiere)
      : [...movies].slice(0, 8);

  useEffect(() => {
    if (!movies.length || isSearching) return;

    const timer = setInterval(() => {
      setFade(true);

      setTimeout(() => {
        setHero((h) => {
          const idx = movies.findIndex((m) => m._id === h?._id);
          return movies[(idx + 1) % movies.length];
        });
        setFade(false);
      }, 400);
    }, 10000);

    return () => clearInterval(timer);
  }, [movies, isSearching]);

  // 💳 Razorpay (ONLY NEW PART)
  const buyPremium = () => {
    const options = {
      key: "rzp_test_123456",
      amount: 19900,
      currency: "INR",
      name: "Netflix Clone",
      description: "Premium Subscription",
      handler: () => {
        upgradeToPremium();
        alert("Premium Activated ✅");
        loadMovies();
      },
      theme: { color: "#e50914" },
    };

    new window.Razorpay(options).open();
  };

  if (loading) return <Loader text="Loading Netflix..." />;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28">

        {!isPremium && (
          <div className="mx-auto max-w-7xl px-6 mb-6">
            <div className="rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-4 flex items-center justify-between">
              <p className="text-yellow-300 font-semibold">
                🔒 Premium required to watch movies
              </p>

              <button
                onClick={buyPremium}
                className="rounded bg-red-600 px-6 py-2 font-semibold"
              >
                Upgrade ₹199
              </button>
            </div>
          </div>
        )}

        {hero && !isSearching && (
          <div
            className={`relative h-[65vh] transition-opacity duration-500 ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          >
            <video
              ref={heroRef}
              src={getStreamUrl(hero._id)}
              autoPlay
              muted
              loop
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          </div>
        )}

        {isSearching && (
          <Section title="Search Results" list={movies} toggleMyList={toggleMyList} myList={myList} />
        )}

        {!isSearching && (
          <>
            <Section title="Premiere" list={premiereMovies} toggleMyList={toggleMyList} myList={myList} />
            <Section title="Continue Watching" list={continueWatching} progress toggleMyList={toggleMyList} myList={myList} />
            <Section title="My List" list={myList} toggleMyList={toggleMyList} myList={myList} />
            <Section title="Trending" list={movies.slice(0, 10)} toggleMyList={toggleMyList} myList={myList} />
            <Section title="Action" list={movies.filter(m=>m.genre?.toLowerCase().includes("action"))} toggleMyList={toggleMyList} myList={myList} />
            <Section title="Horror" list={movies.filter(m=>m.genre?.toLowerCase().includes("horror"))} toggleMyList={toggleMyList} myList={myList} />
            <Section title="Drama" list={movies.filter(m=>m.genre?.toLowerCase().includes("drama"))} toggleMyList={toggleMyList} myList={myList} />
            <Section title="SciFi" list={movies.filter(m=>m.genre?.toLowerCase().includes("scifi"))} toggleMyList={toggleMyList} myList={myList} />
          </>
        )}
      </main>
    </div>
  );
}

/* ================= ROW ================= */

function Section({ title, list, progress, toggleMyList, myList }) {
  if (!list.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {list.map((movie) => {
          const saved = JSON.parse(localStorage.getItem("progress-" + movie._id));
          const percent = saved ? Math.min((saved.time / 3600) * 100, 100) : 0;

          const isSaved = myList?.some((m) => m._id === movie._id);

          return (
            <Link key={movie._id} to={`/details/${movie._id}`} className="group relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleMyList(movie);
                }}
                className="absolute top-2 left-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 border border-white/30 opacity-0 group-hover:opacity-100 transition hover:scale-110"
              >
                {isSaved ? <FaCheck className="text-green-400 text-sm" /> : <FaPlus className="text-white text-sm" />}
              </button>

              <img
                src={getThumbnailUrl(movie.thumbnailUrl)}
                className="h-60 min-w-[160px] rounded-lg object-cover transition group-hover:scale-105"
              />

              {progress && saved && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                  <div className="h-full bg-red-600" style={{ width: `${percent}%` }} />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
