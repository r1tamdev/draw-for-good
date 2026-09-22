import { useState } from 'react';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';

export default function ProofUploadForm({ onSubmit }) {
  const [proofUrl, setProofUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(proofUrl);
      setProofUrl('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <Input
        label="Proof screenshot URL"
        value={proofUrl}
        onChange={(e) => setProofUrl(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Submit proof'}
      </Button>
    </form>
  );
}