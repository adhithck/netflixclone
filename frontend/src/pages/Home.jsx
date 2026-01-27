import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ================= HERO ================= */}
      <main className="pt-16">
        <section className="relative h-[90vh] w-full overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/netflix-bg.png"
              className="h-full w-full object-cover opacity-50"
              alt="Netflix Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
              Unlimited movies, TV shows and more.
            </h1>

            <p className="mt-4 max-w-xl text-lg text-white/80">
              Watch anywhere. Cancel anytime.
            </p>

            <p className="mt-2 text-sm text-white/60">
              Ready to watch? Create your account or sign in.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-red-600 px-8 py-4 text-sm font-semibold hover:bg-red-700"
              >
                Get Started →
              </Link>

              <Link
                to="/login"
                className="rounded-lg bg-white/10 px-8 py-4 text-sm font-semibold hover:bg-white/20"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-3">
            <Feature
              title="Watch Everywhere"
              desc="Stream on phone, tablet, laptop and TV without limits."
              emoji="📺"
            />

            <Feature
              title="Fast Streaming"
              desc="Optimized video streaming using Node + Range headers."
              emoji="⚡"
            />

            <Feature
              title="Secure Login"
              desc="JWT authentication with MongoDB Atlas backend."
              emoji="🔒"
            />
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="border-t border-white/10 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to start watching?
            </h2>

            <p className="mt-3 text-white/70">
              Join today and enjoy unlimited entertainment.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-block rounded-lg bg-red-600 px-10 py-4 font-semibold hover:bg-red-700"
            >
              Create Account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Feature({ title, desc, emoji }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <div className="mb-4 text-4xl">{emoji}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  );
}
