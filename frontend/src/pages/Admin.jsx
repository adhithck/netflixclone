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

  // ================= LOAD MOVIES =================
  const loadMovies = async () => {
    try {
      const list = await adminGetMoviesApi();
      setMovies(list || []);
    } catch (err) {
      console.error(err);
      setMovies([]);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // ================= UPLOAD =================
  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !video || !thumbnail) {
      alert("Title, video and thumbnail required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("genre", form.genre);
      fd.append("year", form.year);
      fd.append("duration", form.duration);
      fd.append("video", video);
      fd.append("thumbnail", thumbnail);

      await uploadMovieApi(fd);

      setMessage("Movie uploaded successfully ✅");

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

      await loadMovies();
    } catch (err) {
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteMovie = async (id) => {
    if (!window.confirm("Delete this movie?")) return;

    await deleteMovieApi(id);
    loadMovies();
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">

        <h1 className="mb-6 text-3xl font-bold">🎬 Admin Panel</h1>

        {/* ================= UPLOAD ================= */}
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
            type="number"
            className="rounded bg-black p-3"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

          <input
            placeholder="Duration (eg: 2h 10m)"
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

          {/* FILES */}
          <div className="col-span-2 flex flex-wrap gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setThumbnail(file);
                setThumbPreview(URL.createObjectURL(file));
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
              alt=""
            />
          )}

          <button
            disabled={loading}
            className="col-span-2 rounded-lg bg-red-600 py-3 font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload Movie"}
          </button>

          {message && (
            <p className="col-span-2 text-green-400 text-sm">{message}</p>
          )}
        </form>

        {/* ================= MOVIES ================= */}
        <h2 className="mb-4 text-xl font-bold">Movies</h2>

        {movies.length === 0 && (
          <p className="text-white/50">No movies uploaded yet.</p>
        )}

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((m) => (
            <div key={m._id} className="group relative overflow-hidden rounded-xl">
              <img
                src={getThumbnailUrl(m.thumbnailUrl)}
                className="h-64 w-full object-cover transition group-hover:scale-105"
                alt=""
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 transition group-hover:opacity-100" />

              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition group-hover:opacity-100">
                <p className="font-semibold">{m.title}</p>

                <button
                  onClick={() => deleteMovie(m._id)}
                  className="mt-2 w-full rounded bg-red-600 py-1 text-sm hover:bg-red-700"
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
