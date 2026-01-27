import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, logout, user } = useAuth();

  const isActive = (path) => location.pathname === path;

  // ✅ Logout → go to Home
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ✅ Home click: scroll if already home, else navigate
  const handleHome = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <button
            onClick={handleHome}
            className="text-xl font-bold text-red-600"
          >
            NETFLIX
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              onClick={handleHome}
              className={`text-sm ${
                isActive("/") ? "text-white" : "text-white/70"
              } hover:text-white`}
            >
              Home
            </button>

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

                {/* Admin */}
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
        <div className="flex items-center gap-3">
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
