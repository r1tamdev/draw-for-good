import axiosInstance from './axiosInstance.js';

export async function getMyWinnings() {
  const { data } =
    await axiosInstance.get('/winners/mine');

  return data;
}

export async function submitProof(
  winnerId,
  proofUrl,
) {
  const { data } =
    await axiosInstance.post(
      `/winners/${winnerId}/proof`,
      {
        proof_url: proofUrl,
      },
    );

  return data;
}

export async function getProofUrl(winnerId) {
  const { data } =
    await axiosInstance.get(
      `/winners/${winnerId}/proof-url`,
    );

  return data.url;
}