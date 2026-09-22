export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 ${className}`}>
      {children}
    </div>
  );
}