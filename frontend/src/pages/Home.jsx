import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero */}
      <main className="pt-16">
        <section className="relative min-h-[85vh] w-full overflow-hidden">
          {/* ✅ Background Image (do not block clicks) */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1400&auto=format&fit=crop"
              alt="Netflix Background"
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Unlimited movies, TV shows and more
            </h1>

            <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
              Watch anywhere. Cancel anytime.
            </p>

            <p className="mt-3 text-sm text-white/70">
              Ready to watch? Create an account or login to continue.
            </p>

            <div className="relative z-20 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="rounded-lg bg-red-600 px-7 py-3 text-sm font-semibold text-white hover:bg-red-700"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="rounded-lg bg-white px-7 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-bold">Watch on any device</h3>
              <p className="mt-2 text-sm text-white/70">
                Stream on mobile, tablet, laptop, and TV.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-bold">Fast streaming</h3>
              <p className="mt-2 text-sm text-white/70">
                Smooth playback using backend streaming (Range headers).
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-bold">Secure login</h3>
              <p className="mt-2 text-sm text-white/70">
                JWT based auth with MongoDB Atlas backend.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
