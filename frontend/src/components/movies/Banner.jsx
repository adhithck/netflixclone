import { Link } from "react-router-dom";
import { getThumbnailUrl } from "../../api/movies.api";
import { truncate } from "../../utils/format";

export default function Banner({ movie }) {
  if (!movie) return null;

  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-black">
      {/* Background image */}
      <img
        src={getThumbnailUrl(movie.thumbnailUrl)}
        alt={movie.title}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-4">
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">
            {movie.title}
          </h1>

          <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
            {truncate(movie.description, 180)}
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to={`/watch/${movie._id}`}
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              ▶ Play
            </Link>

            <Link
              to={`/details/${movie._id}`}
              className="rounded-lg bg-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/30"
            >
              More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
