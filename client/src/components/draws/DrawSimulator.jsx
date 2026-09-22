import { useState } from 'react';
import { simulateDraw, publishDraw } from '../../api/draws.js';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import PoolBreakdown from './PoolBreakdown.jsx';

export default function DrawSimulator() {
  const [mode, setMode] = useState('random');
  const [drawMonth, setDrawMonth] = useState('');
  const [simulated, setSimulated] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const result = await simulateDraw(drawMonth, mode);
      setSimulated(result);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await publishDraw(simulated);
      setSimulated(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-white font-semibold mb-3">Draw configuration</h3>
      <div className="flex gap-3 items-end flex-wrap mb-4">
        <input
          type="date"
          value={drawMonth}
          onChange={(e) => setDrawMonth(e.target.value)}
          className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
        >
          <option value="random">Random</option>
          <option value="algorithmic">Algorithmic</option>
        </select>
        <Button onClick={handleSimulate} disabled={loading}>
          Simulate
        </Button>
      </div>

      {simulated && (
        <div className="flex flex-col gap-3">
          <PoolBreakdown draw={simulated} />
          <p className="text-neutral-400 text-sm">
            Drawn numbers: {simulated.drawn_numbers.join(', ')}
          </p>
          <Button onClick={handlePublish} disabled={loading}>
            Publish draw
          </Button>
        </div>
      )}
    </Card>
  );
}