import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCharities } from '../../api/charities.js';
import CharitySpotlight from '../../components/charity/CharitySpotlight.jsx';
import Button from '../../components/common/Button.jsx';

export default function Home() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    getCharities().then(setCharities).catch(() => setCharities([]));
  }, []);

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Track your scores. Win prizes. Support a cause.
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto mb-6">
          Subscribe, log your scores, and a portion of every membership funds
          the charity you choose — plus a shot at the monthly draw.
        </p>
        <Link to="/signup">
          <Button>Get started</Button>
        </Link>
      </section>

      <CharitySpotlight charities={charities} />
    </div>
  );
}