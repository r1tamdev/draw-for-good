export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-neutral-300">{label}</label>}
      <input
        className={`px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}