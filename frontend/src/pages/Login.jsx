import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16">
        <section className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-extrabold md:text-6xl">
            Unlimited movies, TV shows and more
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Watch anywhere. Cancel anytime.
          </p>

          <div className="mt-8 flex gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold hover:bg-red-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              Sign In
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
