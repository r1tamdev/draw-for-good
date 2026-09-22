import { useEffect, useState } from 'react';
import { getCharities } from '../../api/charities.js';
import CharityCard from '../../components/charity/CharityCard.jsx';
import CharityFilter from '../../components/charity/CharityFilter.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function CharityDirectory() {
  const [charities, setCharities] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCharities().then(setCharities);
  }, []);

  if (!charities) return <Spinner />;

  const filtered = charities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Charities</h1>
      <div className="mb-6 max-w-sm">
        <CharityFilter value={search} onChange={setSearch} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <CharityCard key={c.id} charity={c} />
        ))}
      </div>
    </div>
  );
}