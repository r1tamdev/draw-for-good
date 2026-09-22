import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import WinningsOverview from '../../components/winners/WinningsOverview.jsx';
import ProofUploadForm from '../../components/winners/ProofUploadForm.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function Winnings() {
  const [winnings, setWinnings] = useState(null);

  const refresh = async () => {
    const { data } = await axiosInstance.get('/winners/mine');
    setWinnings(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleProofSubmit = async (winnerId, proofUrl) => {
    await axiosInstance.post(`/winners/${winnerId}/proof`, { proof_url: proofUrl });
    refresh();
  };

  if (!winnings) return <Spinner />;

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Winnings</h1>
      <WinningsOverview winnings={winnings} />
      {winnings
        .filter((w) => !w.proof_url)
        .map((w) => (
          <div key={w.id}>
            <p className="text-neutral-400 text-sm mb-2">
              Upload proof for your {w.match_type}-match win
            </p>
            <ProofUploadForm onSubmit={(url) => handleProofSubmit(w.id, url)} />
          </div>
        ))}
    </div>
  );
}