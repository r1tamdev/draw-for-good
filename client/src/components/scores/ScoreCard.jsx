import Button from '../common/Button.jsx';

export default function ScoreCard({ scoreEntry, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3">
      <div>
        <p className="text-white font-semibold">{scoreEntry.score}</p>
        <p className="text-neutral-500 text-xs">
          {new Date(scoreEntry.score_date).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => onEdit(scoreEntry)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(scoreEntry.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}