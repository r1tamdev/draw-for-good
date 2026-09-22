import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';

export default function CharityCard({ charity }) {
  return (
    <Link to={`/charities/${charity.id}`}>
      <Card className="hover:border-emerald-600 transition-colors">
        {charity.image_url && (
          <img
            src={charity.image_url}
            alt={charity.name}
            className="w-full h-36 object-cover rounded-lg mb-3"
          />
        )}
        <h3 className="text-white font-semibold">{charity.name}</h3>
        <p className="text-neutral-400 text-sm line-clamp-2">{charity.description}</p>
      </Card>
    </Link>
  );
}