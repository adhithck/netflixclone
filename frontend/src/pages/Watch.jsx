import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { getMovieByIdApi, getStreamUrl } from "../api/movies.api.js";
import Loader from "../components/ui/Loader";

export default function Watch() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getMovieByIdApi(id);
        setMovie(data);
      } catch (err) {
        console.log(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main className="pt-16">
          <Loader text="Loading player..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-16">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">{movie?.title}</h1>

            <Link
              to={`/details/${id}`}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
            >
              Back
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              controls
              autoPlay
              className="h-[70vh] w-full bg-black"
              src={getStreamUrl(id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
