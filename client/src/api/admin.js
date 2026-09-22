import axiosInstance from './axiosInstance.js';

export async function getUsers() {
  const { data } = await axiosInstance.get('/admin/users');
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await axiosInstance.put(`/admin/users/${id}`, payload);
  return data;
}

export async function updateUserSubscription(id, payload) {
  const { data } = await axiosInstance.put(`/admin/users/${id}/subscription`, payload);
  return data;
}

export async function getReports() {
  const { data } = await axiosInstance.get('/admin/reports');
  return data;
}

export async function getAllWinners() {
  const { data } = await axiosInstance.get('/winners');
  return data;
}

export async function verifyWinner(id, status) {
  const { data } = await axiosInstance.put(`/winners/${id}/verify`, { verification_status: status });
  return data;
}

export async function markWinnerPaid(id) {
  const { data } = await axiosInstance.put(`/winners/${id}/pay`, { payment_status: 'paid' });
  return data;
}