import { useCallback, useEffect, useState } from 'react';
import { getScores, addScore, updateScore, deleteScore } from '../api/scores.js';

export function useScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getScores();
    setScores(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = async (score, scoreDate) => {
    await addScore(score, scoreDate);
    await refresh();
  };

  const edit = async (id, score) => {
    await updateScore(id, score);
    await refresh();
  };

  const remove = async (id) => {
    await deleteScore(id);
    await refresh();
  };

  return { scores, loading, create, edit, remove, refresh };
}