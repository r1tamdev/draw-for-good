import { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './Auth.jsx';
import { getSubscriptionStatus } from '../api/subscription.js';

export const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getSubscriptionStatus();
      setSubscription(data);
    } catch {
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
}