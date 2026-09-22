import ScoreCard from './ScoreCard.jsx';
import EmptyState from '../common/EmptyState.jsx';

export default function ScoreList({ scores, onEdit, onDelete }) {
  if (!scores.length) {
    return <EmptyState message="No scores entered yet." />;
  }

  return (
    <div className="flex flex-col gap-2">
      {scores.map((s) => (
        <ScoreCard key={s.id} scoreEntry={s} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}