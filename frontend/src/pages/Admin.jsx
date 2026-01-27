import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import {
  uploadMovieApi,
  deleteMovieApi,
  adminGetMoviesApi,
  getThumbnailUrl,
} from "../api/movies.api";

export default function Admin() {
  const [movies, setMovies] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    year: "",
    duration: "",
  });

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [thumbPreview, setThumbPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ================= LOAD =================
  const loadMovies = async () => {
    const data = await adminGetMoviesApi();
    setMovies(data);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !video || !thumbnail) {
      alert("Fill required fields");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("video", video);
      fd.append("thumbnail", thumbnail);

      await uploadMovieApi(fd);

      setMessage("Movie uploaded ✅");

      setForm({
        title: "",
        description: "",
        genre: "",
        year: "",
        duration: "",
      });

      setVideo(null);
      setThumbnail(null);
      setThumbPreview("");

      loadMovies();
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    if (!confirm("Delete movie?")) return;
    await deleteMovieApi(id);
    loadMovies();
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">🎬 Admin Studio</h1>
        </div>

        {/* Upload Card */}
        <form
          onSubmit={submit}
          className="mb-12 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2"
        >
          <input
            placeholder="Movie Title"
            className="rounded bg-black p-3"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Genre"
            className="rounded bg-black p-3"
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
          />

          <input
            placeholder="Year"
            className="rounded bg-black p-3"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <input
            placeholder="Duration"
            className="rounded bg-black p-3"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="col-span-2 rounded bg-black p-3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Upload */}
          <div className="col-span-2 flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setThumbnail(e.target.files[0]);
                setThumbPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>

          {thumbPreview && (
            <img
              src={thumbPreview}
              className="col-span-2 h-48 rounded object-cover"
            />
          )}

          <button className="col-span-2 rounded-lg bg-red-600 py-3 font-semibold hover:bg-red-700">
            {loading ? "Uploading..." : "Upload Movie"}
          </button>

          {message && (
            <p className="col-span-2 text-green-400 text-sm">{message}</p>
          )}
        </form>

        {/* Movies Grid */}
        <h2 className="mb-4 text-xl font-bold">Movies</h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {movies.map((m) => (
            <div
              key={m._id}
              className="group relative overflow-hidden rounded-xl"
            >
              <img
                src={getThumbnailUrl(m.thumbnailUrl)}
                className="h-64 w-full object-cover transition group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 transition group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition group-hover:opacity-100">
                <p className="font-semibold">{m.title}</p>

                <button
                  onClick={() => deleteMovie(m._id)}
                  className="mt-2 w-full rounded bg-red-600 py-1 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
