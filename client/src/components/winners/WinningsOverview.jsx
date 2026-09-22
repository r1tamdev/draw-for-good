import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

export default function WinningsOverview({ winnings }) {
  const total = winnings.reduce((sum, w) => sum + Number(w.amount), 0);

  return (
    <Card>
      <h3 className="text-white font-semibold mb-3">Winnings</h3>
      <p className="text-2xl font-bold text-emerald-400 mb-4">{total}</p>
      <div className="flex flex-col gap-2">
        {winnings.map((w) => (
          <div key={w.id} className="flex justify-between items-center text-sm">
            <span className="text-neutral-300">{w.match_type}-match — {w.amount}</span>
            <Badge status={w.payment_status} />
          </div>
        ))}
      </div>
    </Card>
  );
}