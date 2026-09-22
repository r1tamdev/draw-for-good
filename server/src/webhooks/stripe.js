import { supabaseAdmin } from '../config/supabase.js';
import { constructWebhookEvent } from '../services/stripe.js';

export async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, plan } = session.metadata;

    await supabaseAdmin.from('subscriptions').insert({
      user_id: userId,
      plan,
      status: 'active',
      stripe_subscription_id: session.subscription,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;

    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const status = subscription.status === 'active' ? 'active' : 'lapsed';

    await supabaseAdmin
      .from('subscriptions')
      .update({ status })
      .eq('stripe_subscription_id', subscription.id);
  }

  res.json({ received: true });
}