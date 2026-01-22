import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const isActive = (path) => location.pathname === path;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link to="/browse" className="text-xl font-bold text-red-600">
            NETFLIX
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <Link
              to="/browse"
              className={`text-sm ${
                isActive("/browse") ? "text-white" : "text-white/70"
              } hover:text-white`}
            >
              Home
            </Link>

            <Link
              to="/browse"
              className="text-sm text-white/70 hover:text-white"
            >
              Movies
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {!token ? (
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
              onClick={logout}
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
