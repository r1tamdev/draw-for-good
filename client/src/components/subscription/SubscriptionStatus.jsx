import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';

export default function SubscriptionStatus({ subscription }) {
  if (!subscription) {
    return (
      <Card>
        <p className="text-neutral-400">No active subscription.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold capitalize">{subscription.plan} plan</h3>
        <Badge status={subscription.status} />
      </div>
      <p className="text-neutral-400 text-sm">
        Renews: {subscription.current_period_end
          ? new Date(subscription.current_period_end).toLocaleDateString()
          : 'N/A'}
      </p>
    </Card>
  );
}