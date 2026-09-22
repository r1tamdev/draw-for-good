import { useEffect, useState } from 'react';
import { getCharities, createCharity, updateCharity, deleteCharity } from '../../api/charities.js';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import Spinner from '../common/Spinner.jsx';

export default function CharityManager() {
  const [charities, setCharities] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const refresh = async () => {
    const data = await getCharities();
    setCharities(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createCharity({ name, description });
    setName('');
    setDescription('');
    refresh();
  };

  const handleToggleSpotlight = async (charity) => {
    await updateCharity(charity.id, { is_spotlighted: !charity.is_spotlighted });
    refresh();
  };

  const handleDelete = async (id) => {
    await deleteCharity(id);
    refresh();
  };

  if (!charities) return <Spinner />;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreate} className="flex gap-3 items-end flex-wrap">
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit">Add charity</Button>
      </form>

      <div className="flex flex-col gap-2">
        {charities.map((c) => (
          <div
            key={c.id}
            className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3"
          >
            <div>
              <p className="text-white font-semibold">{c.name}</p>
              <p className="text-neutral-500 text-xs">{c.description}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleToggleSpotlight(c)}>
                {c.is_spotlighted ? 'Unspotlight' : 'Spotlight'}
              </Button>
              <Button variant="danger" onClick={() => handleDelete(c.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}