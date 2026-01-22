export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-white/60">
        <p>Netflix Clone © {new Date().getFullYear()}</p>
        <p className="mt-1">Built with React + Tailwind + Node + MongoDB Atlas</p>
      </div>
    </footer>
  );
}
