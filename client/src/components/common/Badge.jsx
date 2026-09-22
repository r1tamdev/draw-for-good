const COLORS = {
  active: 'bg-emerald-900 text-emerald-300',
  inactive: 'bg-neutral-800 text-neutral-400',
  cancelled: 'bg-red-900 text-red-300',
  lapsed: 'bg-amber-900 text-amber-300',
  pending: 'bg-amber-900 text-amber-300',
  paid: 'bg-emerald-900 text-emerald-300',
  approved: 'bg-emerald-900 text-emerald-300',
  rejected: 'bg-red-900 text-red-300',
};

export default function Badge({ status }) {
  const style = COLORS[status] || 'bg-neutral-800 text-neutral-300';
  return (
    <span className={`text-xs px-2 py-1 rounded-full capitalize ${style}`}>
      {status}
    </span>
  );
}