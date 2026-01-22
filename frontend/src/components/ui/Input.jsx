export default function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  className = "",
  required = false,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-white/80">
          {label}
        </label>
      )}

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={onChange}
        className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-red-500"
      />
    </div>
  );
}
