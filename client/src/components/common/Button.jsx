export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    secondary: 'bg-neutral-800 text-white hover:bg-neutral-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-neutral-600 text-neutral-200 hover:bg-neutral-800',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}