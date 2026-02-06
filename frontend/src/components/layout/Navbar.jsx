import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { getAllMoviesApi, getThumbnailUrl } from "../../api/movies.api";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem("recent-searches") || "[]")
  );

  const boxRef = useRef();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    window.scrollTo({ top: 0 });
  };

  const handleHomeClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Load movies once for instant search
  useEffect(() => {
    const load = async () => {
      const data = await getAllMoviesApi();
      setAllMovies(data.movies || []);
    };
    load();
  }, []);

  // Live filter
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = allMovies
      .filter((m) => m.title?.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);

    setResults(filtered);
    setActiveIndex(-1);
  }, [query, allMovies]);

  // Save recent searches
  const saveRecent = (text) => {
    if (!text) return;
    const updated = [text, ...recent.filter((r) => r !== text)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent-searches", JSON.stringify(updated));
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!results.length) {
      if (e.key === "Enter") {
        saveRecent(query);
        navigate(`/browse?q=${encodeURIComponent(query)}`);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      const chosen = results[activeIndex];
      if (chosen) {
        navigate(`/details/${chosen._id}`);
      } else {
        saveRecent(query);
        navigate(`/browse?q=${encodeURIComponent(query)}`);
      }
      setResults([]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const click = (e) => {
      if (!boxRef.current?.contains(e.target)) setResults([]);
    };
    document.addEventListener("mousedown", click);
    return () => document.removeEventListener("mousedown", click);
  }, []);

  // Highlight matched text
  const highlight = (text) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-red-500">
          {p}
        </span>
      ) : (
        p
      )
    );
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="text-xl font-bold text-red-600"
          >
            NETFLIX
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/"
              onClick={handleHomeClick}
              className={`text-sm ${
                isActive("/") ? "text-white" : "text-white/70"
              } hover:text-white`}
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/browse"
                  className={`text-sm ${
                    isActive("/browse") ? "text-white" : "text-white/70"
                  } hover:text-white`}
                >
                  Browse
                </Link>

                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-sm ${
                      isActive("/admin") ? "text-white" : "text-white/70"
                    } hover:text-white`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 relative" ref={boxRef}>
          {isLoggedIn && (
            <>
              {/* ⭐ PREMIUM BADGE */}
              {user?.isPremium && (
                <span className="rounded bg-yellow-500 px-2 py-1 text-[10px] font-bold text-black">
                  PREMIUM
                </span>
              )}

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                  🔍
                </span>

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-[160px] rounded-full bg-black/70 border border-white/20 pl-8 pr-3 py-1.5 text-sm outline-none text-white focus:w-[240px] transition-all"
                />

                {/* RECENT SEARCHES */}
                {!query && recent.length > 0 && (
                  <div className="absolute right-0 mt-2 w-72 rounded-md bg-black border border-white/10">
                    {recent.map((r, i) => (
                      <div
                        key={i}
                        onClick={() => navigate(`/browse?q=${encodeURIComponent(r)}`)}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-white/10"
                      >
                        ⏱ {r}
                      </div>
                    ))}
                  </div>
                )}

                {/* RESULTS */}
                {results.length > 0 && (
                  <div className="absolute right-0 mt-2 w-72 rounded-md bg-black border border-white/10 shadow-lg">
                    {results.map((m, i) => (
                      <div
                        key={m._id}
                        onClick={() => navigate(`/details/${m._id}`)}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                          i === activeIndex ? "bg-white/10" : ""
                        }`}
                      >
                        <img
                          src={getThumbnailUrl(m.thumbnailUrl)}
                          className="h-10 w-8 rounded object-cover"
                        />

                        <div className="flex flex-col">
                          <span className="text-sm">{highlight(m.title)}</span>

                          {/* 🎬 PREMIERE */}
                          {m.isPremiere && (
                            <span className="mt-0.5 w-fit rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              PREMIERE
                            </span>
                          )}

                          {/* 🔒 PREMIUM MOVIE */}
                          {m.premiumOnly && !user?.isPremium && (
                            <span className="mt-0.5 text-[10px] text-yellow-400">
                              🔒 Premium Only
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
