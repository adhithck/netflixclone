import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [myList, setMyList] = useState([]);
  const [hero, setHero] = useState(null);

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [fade, setFade] = useState(false);

  const isSearching = query.trim().length > 0;

  // ================= LOAD =================
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

    setMovies(list);
    setAllMovies(list);

    const last = localStorage.getItem("lastWatched");
    setHero(last ? JSON.parse(last) : list[0]);

    setLoading(false);
  };

  // ================= CONTINUE WATCHING (LOCAL) =================
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

  // ================= FAVORITES (SERVER) =================
  const loadMyList = async () => {
    const favs = await getFavoritesApi();
    setMyList(favs || []);
  };

  const toggleMyList = async (movie) => {
    const updated = await toggleFavoriteApi(movie._id);
    setMyList(updated);
  };

  // ================= HERO AUTO =================
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

  // ================= PAUSE HERO =================
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;

      if (window.scrollY > 300) heroRef.current.pause();
      else heroRef.current.play().catch(() => {});
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ================= SEARCH (LOCAL) =================
  const handleSearch = (e) => {
    const v = e.target.value;
    setQuery(v);

    if (!v.trim()) {
      setMovies(allMovies);
      return;
    }

    const filtered = allMovies.filter((m) =>
      m.title?.toLowerCase().includes(v.toLowerCase())
    );

    setMovies(filtered);
  };

  if (loading) return <Loader text="Loading Netflix..." />;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16">
        {/* SEARCH */}
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <input
            value={query}
            onChange={handleSearch}
            placeholder="Search movies..."
            className="w-full rounded bg-white/10 px-4 py-3 outline-none"
          />
        </div>

        {/* HERO */}
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

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
              <h1 className="text-4xl font-bold">{hero.title}</h1>

              <Link
                to={`/watch/${hero._id}`}
                className="mt-4 w-fit rounded bg-white px-6 py-2 text-black font-semibold"
              >
                ▶ Resume
              </Link>
            </div>
          </div>
        )}

        {/* SEARCH RESULTS */}
        {isSearching && (
          <Section title="Search Results" list={movies} toggleMyList={toggleMyList} />
        )}

        {!isSearching && (
          <>
            <Section title="Continue Watching" list={continueWatching} progress toggleMyList={toggleMyList} />
            <Section title="My List" list={myList} toggleMyList={toggleMyList} />
            <Section title="Trending" list={movies.slice(0, 10)} toggleMyList={toggleMyList} />
            <Section title="Action" list={movies.filter(m=>m.genre?.toLowerCase().includes("action"))} toggleMyList={toggleMyList} />
            <Section title="Horror" list={movies.filter(m=>m.genre?.toLowerCase().includes("horror"))} toggleMyList={toggleMyList} />
            <Section title="Drama" list={movies.filter(m=>m.genre?.toLowerCase().includes("drama"))} toggleMyList={toggleMyList} />
            <Section title="SciFi" list={movies.filter(m=>m.genre?.toLowerCase().includes("scifi"))} toggleMyList={toggleMyList} />
          </>
        )}
      </main>
    </div>
  );
}

/* ================= ROW ================= */

function Section({ title, list, progress, toggleMyList }) {
  if (!list.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {list.map((movie) => {
          const saved = JSON.parse(localStorage.getItem("progress-" + movie._id));
          const percent = saved ? Math.min((saved.time / 3600) * 100, 100) : 0;

          return (
            <Link key={movie._id} to={`/details/${movie._id}`} className="group relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleMyList(movie);
                }}
                className="absolute top-2 left-2 z-10 bg-black/70 px-2 rounded"
              >
                ❤️
              </button>

              <img
                src={getThumbnailUrl(movie.thumbnailUrl)}
                className="h-60 min-w-[160px] rounded-lg object-cover transition group-hover:scale-105"
              />

              <div className="absolute bottom-0 w-full bg-black/60 p-2 text-sm">
                {movie.title}
              </div>

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
