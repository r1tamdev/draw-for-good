import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function ScoreForm({ onSubmit }) {
  const [score, setScore] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(Number(score), date);
      setScore('');
      setDate('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end flex-wrap">
      <Input
        label="Score (1-45)"
        type="number"
        min={1}
        max={45}
        value={score}
        onChange={(e) => setScore(e.target.value)}
        required
      />
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add score'}
      </Button>
    </form>
  );
}