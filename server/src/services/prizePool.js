export function calculatePoolSplit(totalPool, jackpotRollover) {
  const pool5 = totalPool * 0.4 + jackpotRollover;
  const pool4 = totalPool * 0.35;
  const pool3 = totalPool * 0.25;

  return { pool5, pool4, pool3 };
}

export async function getActiveSubscriberCount(supabaseAdmin) {
  const { count, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  if (error) throw error;
  return count || 0;
}

export function calculateTotalPool(activeSubscriberCount, avgSubscriptionValue, poolContributionRate) {
  return activeSubscriberCount * avgSubscriptionValue * poolContributionRate;
}