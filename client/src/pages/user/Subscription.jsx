import { useState, useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription.js';
import { getCharities, selectCharity } from '../../api/charities.js';
import PlanCard from '../../components/subscription/PlanCard.jsx';
import CheckoutButton from '../../components/subscription/CheckoutButton.jsx';
import CharitySelector from '../../components/charity/CharitySelector.jsx';
import ContributionSlider from '../../components/charity/ContributionSlider.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';

export default function Subscription() {
  const { subscription, loading, refresh } = useSubscription();
  const [charities, setCharities] = useState([]);
  const [charityId, setCharityId] = useState('');
  const [contribution, setContribution] = useState(10);

  useEffect(() => {
    getCharities().then(setCharities);
  }, []);

  useEffect(() => {
    if (subscription?.charity_id) setCharityId(subscription.charity_id);
    if (subscription?.charity_contribution_pct) {
      setContribution(subscription.charity_contribution_pct);
    }
  }, [subscription]);

  const handleSaveCharity = async () => {
    await selectCharity(charityId, contribution);
    refresh();
  };

  if (loading) return <Spinner />;

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="px-6 py-10 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <PlanCard
          plan="monthly"
          price="$9/mo"
          features={['Score tracking', 'Monthly draw entry', 'Charity giving']}
          onSelect={() => {}}
        />
        <PlanCard
          plan="yearly"
          price="$90/yr"
          features={['Everything monthly has', '2 months free']}
          onSelect={() => {}}
        />
        <div className="col-span-2 flex gap-3 justify-center">
          <CheckoutButton plan="monthly" />
          <CheckoutButton plan="yearly" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-md mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">Your charity</h1>
      <CharitySelector charities={charities} value={charityId} onChange={setCharityId} />
      <ContributionSlider value={contribution} onChange={setContribution} />
      <Button onClick={handleSaveCharity}>Save</Button>
    </div>
  );
}