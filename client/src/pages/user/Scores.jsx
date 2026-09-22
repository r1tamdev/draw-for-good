import { useState } from 'react';
import { useScores } from '../../hooks/useScores.js';
import ScoreForm from '../../components/scores/ScoreForm.jsx';
import ScoreList from '../../components/scores/ScoreList.jsx';
import ScoreEditModal from '../../components/scores/ScoreEditModal.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function Scores() {
  const { scores, loading, create, edit, remove } = useScores();
  const [editing, setEditing] = useState(null);

  if (loading) return <Spinner />;

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