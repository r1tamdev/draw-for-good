import { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function ScoreEditModal({ open, scoreEntry, onClose, onSave }) {
  const [score, setScore] = useState('');

  useEffect(() => {
    if (scoreEntry) setScore(scoreEntry.score);
  }, [scoreEntry]);

  const handleSave = async () => {
    await onSave(scoreEntry.id, Number(score));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit score">
      <div className="flex flex-col gap-4">
        <Input
          label="Score (1-45)"
          type="number"
          min={1}
          max={45}
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <Button onClick={handleSave}>Save</Button>
      </div>
    </Modal>
  );
}