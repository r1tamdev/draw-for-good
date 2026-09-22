import { env } from '../config/env.js';

export function calculatePoolSplit(totalPool, jackpotRollover = 0) {
  const pool5 = totalPool * 0.4 + Number(jackpotRollover || 0);
  const pool4 = totalPool * 0.35;
  const pool3 = totalPool * 0.25;

  return {
    pool5: Number(pool5.toFixed(2)),
    pool4: Number(pool4.toFixed(2)),
    pool3: Number(pool3.toFixed(2)),
  };
}

export async function getActiveSubscriptions(supabaseAdmin) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id, plan, status')
    .eq('status', 'active');

  if (error) throw error;

  return data || [];
}

export async function getActiveSubscriberCount(supabaseAdmin) {
  const subscriptions = await getActiveSubscriptions(supabaseAdmin);
  return subscriptions.length;
}

export function calculateTotalPool(
  activeSubscriptions,
  poolContributionRate = env.prizePoolContributionRate,
) {
  return activeSubscriptions.reduce((total, subscription) => {
    const subscriptionValue =
      subscription.plan === 'yearly'
        ? env.yearlySubscriptionValue
        : env.monthlySubscriptionValue;

    return total + subscriptionValue * poolContributionRate;
  }, 0);
}