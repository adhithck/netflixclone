import MovieCard from "./MovieCard";
import MovieSkeleton from "./MovieSkeleton";

export default function MovieRow({ title = "Movies", movies = [], loading }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <MovieSkeleton key={i} />)
          : movies.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
      </div>
    </section>
  );
}
