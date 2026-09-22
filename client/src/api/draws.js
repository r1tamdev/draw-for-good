import axiosInstance from './axiosInstance.js';

export async function getUpcomingDraw() {
  const { data } = await axiosInstance.get('/draws/upcoming');
  return data;
}

export async function getDraws() {
  const { data } = await axiosInstance.get('/draws');
  return data;
}

export async function simulateDraw(drawMonth, mode) {
  const { data } = await axiosInstance.post('/draws/simulate', { draw_month: drawMonth, mode });
  return data;
}

export async function publishDraw(simulatedDraw) {
  const { data } = await axiosInstance.post('/draws/publish', simulatedDraw);
  return data;
}