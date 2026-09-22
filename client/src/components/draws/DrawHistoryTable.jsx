import { useEffect, useState } from 'react';
import { getDraws } from '../../api/draws.js';
import Spinner from '../common/Spinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function DrawHistoryTable() {
  const [draws, setDraws] = useState(null);

  useEffect(() => {
    getDraws().then(setDraws).catch(() => setDraws([]));
  }, []);

  if (!draws) return <Spinner />;
  if (!draws.length) return <EmptyState message="No draws run yet." />;

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-neutral-500 border-b border-neutral-800">
          <th className="py-2">Month</th>
          <th className="py-2">Mode</th>
          <th className="py-2">Status</th>
          <th className="py-2">Total pool</th>
          <th className="py-2">Rollover</th>
        </tr>
      </thead>
      <tbody>
        {draws.map((d) => (
          <tr key={d.id} className="border-b border-neutral-900">
            <td className="py-2 text-white">
              {new Date(d.draw_month).toLocaleDateString()}
            </td>
            <td className="py-2 text-neutral-300 capitalize">{d.mode}</td>
            <td className="py-2 text-neutral-300 capitalize">{d.status}</td>
            <td className="py-2 text-white">{d.total_pool}</td>
            <td className="py-2 text-amber-400">{d.jackpot_rollover || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}