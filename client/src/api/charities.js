import axiosInstance from "./axiosInstance";

export async function getCharities() {
  const { data } = await axiosInstance.get("/charities");
  return data;
}

export async function getCharity(id) {
  const { data } = await axiosInstance.get(`/charities/${id}`);
  return data;
}

export async function selectCharity(charityId, contributionPct) {
  const { data } = await axiosInstance.post('/charities/select', {
    charity_id: charityId,
    charity_contribution_pct: contributionPct,
  });
  return data;
}

export async function createCharity(payload) {
  const { data } = await axiosInstance.post('/charities', payload);
  return data;
}

export async function updateCharity(id, payload) {
  const { data } = await axiosInstance.put(`/charities/${id}`, payload);
  return data;
}

export async function deleteCharity(id) {
  const { data } = await axiosInstance.delete(`/charities/${id}`);
  return data;
}