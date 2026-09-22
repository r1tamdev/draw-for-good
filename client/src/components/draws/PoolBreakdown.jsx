import Card from '../common/Card.jsx';

export default function PoolBreakdown({ draw }) {
  if (!draw) return null;

  return (
    <Card>
      <h3 className="text-white font-semibold mb-3">Prize pool breakdown</h3>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-neutral-500 text-xs">5-match</p>
          <p className="text-emerald-400 font-bold">{draw.pool_5}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs">4-match</p>
          <p className="text-emerald-400 font-bold">{draw.pool_4}</p>
        </div>
        <div>
          <p className="text-neutral-500 text-xs">3-match</p>
          <p className="text-emerald-400 font-bold">{draw.pool_3}</p>
        </div>
      </div>
      {draw.jackpot_rollover > 0 && (
        <p className="text-amber-400 text-sm mt-3">
          Jackpot rollover: {draw.jackpot_rollover}
        </p>
      )}
    </Card>
  );
}