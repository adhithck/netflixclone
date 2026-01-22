export default function Button({
  children,
  type = "button",
  onClick,
  disabled,
  className = "",
  variant = "primary", // primary | secondary | ghost
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-white text-black hover:bg-white/90",
    ghost: "bg-white/10 text-white hover:bg-white/20",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
