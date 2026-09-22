import { useContext } from 'react';
import { SubscriptionContext } from '../context/Subscription.jsx';

export function useSubscription() {
  return useContext(SubscriptionContext);
}