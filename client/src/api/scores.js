import axiosInstance from './axiosInstance.js';

export async function getScores() {
  const { data } = await axiosInstance.get('/scores');
  return data;
}

export async function addScore(score, scoreDate) {
  const { data } = await axiosInstance.post('/scores', { score, score_date: scoreDate });
  return data;
}

export async function updateScore(id, score) {
  const { data } = await axiosInstance.put(`/scores/${id}`, { score });
  return data;
}

export async function deleteScore(id) {
  await axiosInstance.delete(`/scores/${id}`);
}