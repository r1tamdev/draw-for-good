import { useState, useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription.js';
import { getCharities, selectCharity } from '../../api/charities.js';
import CharitySelector from '../../components/charity/CharitySelector.jsx';
import CheckoutButton from '../../components/subscription/CheckoutButton.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function Subscription() {
  const { subscription, loading, refresh } = useSubscription();

  const [charities, setCharities] = useState([]);
  const [charityId, setCharityId] = useState('');
  const [contribution, setContribution] = useState(10);

  useEffect(() => {
    getCharities()
      .then(setCharities)
      .catch((error) => {
        console.error('Failed to load charities:', error);
      });
  }, []);

  useEffect(() => {
    if (subscription?.charity_id) {
      setCharityId(subscription.charity_id);
    }
  }, [subscription]);

  const handleSaveCharity = async () => {
    try {
      await selectCharity(charityId, contribution);
      await refresh();
    } catch (error) {
      console.error('Failed to save charity:', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="px-6 py-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">
            Choose Your Subscription
          </h1>

          <p className="text-neutral-400 mt-3 text-lg">
            Subscribe to enter monthly draws and support a charity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col">
            <h2 className="text-3xl font-bold text-white">
              Monthly
            </h2>

            <p className="text-4xl font-bold text-emerald-400 mt-5">
              $9<span className="text-xl">/mo</span>
            </p>

            <ul className="mt-6 space-y-3 text-neutral-300 text-lg">
              <li>• Score tracking</li>
              <li>• Monthly draw entry</li>
              <li>• Charity giving</li>
            </ul>

            <div className="mt-8">
              <CheckoutButton plan="monthly" />
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col">
            <h2 className="text-3xl font-bold text-white">
              Yearly
            </h2>

            <p className="text-4xl font-bold text-emerald-400 mt-5">
              $90<span className="text-xl">/yr</span>
            </p>

            <ul className="mt-6 space-y-3 text-neutral-300 text-lg">
              <li>• Everything monthly has</li>
              <li className='mb-8'>• 2 months free</li>
            </ul>

            <div className="mt-8">
              <CheckoutButton plan="yearly" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">
        Your Charity
      </h1>

      <CharitySelector
        charities={charities}
        value={charityId}
        onChange={setCharityId}
      />

      <Button onClick={handleSaveCharity}>
        Save
      </Button>
    </div>
  );
}