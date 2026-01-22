import { Link } from "react-router-dom";
import { getThumbnailUrl } from "../../api/movies.api";
import { truncate } from "../../utils/format";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/details/${movie._id}`}
      className="group relative min-w-[140px] overflow-hidden rounded-xl bg-white/5 shadow-sm transition hover:scale-[1.03] md:min-w-[180px]"
    >
      <img
        src={getThumbnailUrl(movie.thumbnailUrl)}
        alt={movie.title}
        className="h-[200px] w-full object-cover md:h-[260px]"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition group-hover:opacity-100">
        <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
        <p className="mt-1 text-xs text-white/70">
          {truncate(movie.description, 60)}
        </p>
      </div>
    </Link>
  );
}
