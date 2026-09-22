export default function Toast({ message, type = 'info', onClose }) {
  const colors = {
    info: 'bg-neutral-800',
    success: 'bg-emerald-700',
    error: 'bg-red-700',
  };

  return (
    <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white shadow-lg ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}