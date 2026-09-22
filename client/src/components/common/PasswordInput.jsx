import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ label, error, className = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-neutral-300">{label}</label>}
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          className={`w-full px-3 py-2 pr-10 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}