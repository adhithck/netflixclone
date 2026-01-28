import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Loader from "../components/ui/Loader";

import {
  getAllMoviesApi,
  getThumbnailUrl,
  searchMoviesApi,
  getStreamUrl,
} from "../api/movies.api";

export default function Browse() {
  const heroRef = useRef(null);

  const [movies, setMovies] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
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
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    const data = await getAllMoviesApi();
    const list = data.movies || [];

    setMovies(list);

    const last = localStorage.getItem("lastWatched");
    setHero(last ? JSON.parse(last) : list[0]);

    setLoading(false);
  };

  // ================= CONTINUE WATCHING =================
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

  // ================= HERO AUTO SWITCH =================
  useEffect(() => {
    if (!movies.length) return;

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
  }, [movies]);

  // ================= PAUSE HERO ON SCROLL =================
  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;

      if (window.scrollY > 300) heroRef.current.pause();
      else heroRef.current.play().catch(() => {});
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ================= SEARCH =================
  const handleSearch = async (e) => {
  const v = e.target.value;
  setQuery(v);

  if (!v.trim()) {
    loadMovies();
    return;
  }

  const data = await searchMoviesApi(v);
  setMovies(data.movies || []);
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
              <h1 className="text-4xl font-bold max-w-xl">{hero.title}</h1>

              <Link
                to={`/watch/${hero._id}`}
                className="mt-4 w-fit rounded bg-white px-6 py-2 text-black font-semibold"
              >
                ▶ Resume
              </Link>
            </div>
          </div>
        )}

        {/* ROWS */}
        <Section title="Continue Watching" list={continueWatching} progress />

       {!isSearching ? (
  <>
   {!isSearching ? (
  <>
    <Section title="Trending" list={movies.slice(0, 10)} />

    <Section
      title="Action"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("action")
      )}
    />

    <Section
      title="Horror"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("horror")
      )}
    />

    <Section
      title="Drama"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("drama")
      )}
    />

    <Section
      title="SciFi"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("scifi")
      )}
    />
  </>
) : (
  <Section title="Search Results" list={movies} />
)}

    <Section
      title="Action"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("action")
      )}
    />

    <Section
      title="Horror"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("horror")
      )}
    />

    <Section
      title="Drama"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("drama")
      )}
    />

    <Section
      title="SciFi"
      list={movies.filter((m) =>
        m.genre?.toLowerCase().includes("scifi")
      )}
    />
  </>
) : (
  <Section title="Search Results" list={movies} />
)}

        
      </main>
    </div>
  );
}

/* ================= ROW SECTION ================= */

function Section({ title, list, progress }) {
  if (!list.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {list.map((movie) => {
          const saved = JSON.parse(localStorage.getItem("progress-" + movie._id));
          const percent = saved ? Math.min((saved.time / 3600) * 100, 100) : 0;

          return (
            <Link
              key={movie._id}
              to={`/details/${movie._id}`}
              className="group relative overflow-hidden rounded-lg"
            >
              <img
                src={getThumbnailUrl(movie.thumbnailUrl)}
                className="h-60 min-w-[160px] object-cover transition group-hover:scale-105"
              />

              <div className="absolute bottom-0 w-full translate-y-full p-2 text-sm font-semibold transition group-hover:translate-y-0 bg-black/60">
                {movie.title}
              </div>

              {progress && saved && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                    <div
                      className="h-full bg-red-600"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="absolute top-1 right-1 bg-black/70 px-1 text-xs">
                    {percent.toFixed(0)}%
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
