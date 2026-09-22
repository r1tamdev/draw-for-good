import { useEffect, useState } from 'react';
import { supabase } from '../../api/supabase.js';
import {
  getMyWinnings,
  submitProof,
} from '../../api/winners.js';
import WinningsOverview from '../../components/winners/WinningsOverview.jsx';
import ProofUploadForm from '../../components/winners/ProofUploadForm.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function Winnings() {
  const [winnings, setWinnings] = useState(null);

  const refresh = async () => {
    setWinnings(
      await getMyWinnings(),
    );
  };

  useEffect(() => {
    refresh().catch(() => {
      setWinnings([]);
    });
  }, []);

  const handleProofSubmit = async (
    winnerId,
    file,
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error(
        'You must be logged in',
      );
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Only PNG, JPEG, and WebP images are allowed.',
      );
    }

    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase() || 'png';

    const path =
      `${user.id}/${winnerId}-${Date.now()}.${extension}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from('winner-proofs')
      .upload(
        path,
        file,
        {
          contentType: file.type,
          upsert: false,
        },
      );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicUrlData,
    } = supabase.storage
      .from('winner-proofs')
      .getPublicUrl(path);

    await submitProof(
      winnerId,
      publicUrlData.publicUrl,
    );

    await refresh();
  };

  if (!winnings) {
    return <Spinner />;
  }

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">
        Winnings
      </h1>

      <WinningsOverview
        winnings={winnings}
      />

      {winnings
        .filter(
          (winner) =>
            !winner.proof_url &&
            winner.verification_status ===
              'pending',
        )
        .map((winner) => (
          <div
            key={winner.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <p className="text-neutral-300 text-sm mb-3">
              Upload a screenshot of your
              golf-platform scores for your{' '}
              {winner.match_type}-match win.
            </p>

            <ProofUploadForm
              onSubmit={(file) =>
                handleProofSubmit(
                  winner.id,
                  file,
                )
              }
            />
          </div>
        ))}
    </div>
  );
}