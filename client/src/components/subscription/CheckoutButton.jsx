import { useState } from 'react';
import { createSubscription } from '../../api/subscription.js';
import Button from '../common/Button.jsx';

export default function CheckoutButton({ plan }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { checkoutUrl } = await createSubscription(plan);
      window.location.href = checkoutUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? 'Redirecting...' : `Subscribe (${plan})`}
    </Button>
  );
}