export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-white/80">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
