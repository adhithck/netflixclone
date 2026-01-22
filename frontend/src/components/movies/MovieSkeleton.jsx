export default function MovieSkeleton() {
  return (
    <div className="min-w-[140px] animate-pulse overflow-hidden rounded-xl bg-white/10 md:min-w-[180px]">
      <div className="h-[200px] w-full bg-white/10 md:h-[260px]" />
      <div className="p-3">
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="mt-2 h-3 w-full rounded bg-white/10" />
      </div>
    </div>
  );
}
