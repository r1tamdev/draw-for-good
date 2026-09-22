import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCharity } from '../../api/charities.js';
import Spinner from '../../components/common/Spinner.jsx';

export default function CharityDetail() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    getCharity(id).then(setCharity);
  }, [id]);

  if (!charity) return <Spinner />;

  return (
    <div className="px-6 py-10 max-w-3xl mx-auto">
      {charity.image_url && (
        <img
          src={charity.image_url}
          alt={charity.name}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      <h1 className="text-3xl font-bold text-white mb-3">{charity.name}</h1>
      <p className="text-neutral-400">{charity.description}</p>
    </div>
  );
}