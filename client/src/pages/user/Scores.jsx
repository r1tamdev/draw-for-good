import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScores } from '../../hooks/useScores.js';
import ScoreForm from '../../components/scores/ScoreForm.jsx';
import ScoreList from '../../components/scores/ScoreList.jsx';
import ScoreEditModal from '../../components/scores/ScoreEditModal.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Button from '../../components/common/Button.jsx';

export default function Scores() {
  const { scores, loading, error, create, edit, remove } = useScores();
  const [editing, setEditing] = useState(null);

  if (loading) return <Spinner />;

  if (error === 'no_subscription') {
    return (
      <div className="px-6 py-10 max-w-md mx-auto text-center">
        <h1 className="text-xl font-bold text-white mb-2">Subscribe to log scores</h1>
        <p className="text-neutral-400 mb-6">
          Score entry is available to active subscribers only.
        </p>
        <Link to="/subscribe">
          <Button>View plans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Your scores</h1>
      <ScoreForm onSubmit={create} />
      <ScoreList scores={scores} onEdit={setEditing} onDelete={remove} />
      <ScoreEditModal
        open={!!editing}
        scoreEntry={editing}
        onClose={() => setEditing(null)}
        onSave={edit}
      />
    </div>
  );
}