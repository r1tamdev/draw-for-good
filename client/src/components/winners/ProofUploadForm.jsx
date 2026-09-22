import { useState } from 'react';
import Button from '../common/Button.jsx';

export default function ProofUploadForm({
  onSubmit,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be smaller than 5MB.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onSubmit(file);

      setFile(null);
      event.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Upload failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3"
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) =>
          setFile(
            event.target.files?.[0] || null,
          )
        }
        required
        className="block w-full text-sm text-neutral-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white"
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading || !file}
      >
        {loading
          ? 'Uploading...'
          : 'Upload proof'}
      </Button>
    </form>
  );
}