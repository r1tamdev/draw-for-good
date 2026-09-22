import { supabaseAdmin } from '../config/supabase.js';
import { createCheckoutSession, cancelSubscription } from '../services/stripe.js';
import { subscriptionSchema } from '../utils/validators.js';

export async function createSubscription(req, res, next) {
  try {
    const { error: validationError, value } = subscriptionSchema.validate(req.body);
    if (validationError) return res.status(400).json({ error: validationError.message });

    const session = await createCheckoutSession(req.user.id, value.plan, req.user.email);

    res.json({ checkoutUrl: session.url });
  } catch (err) {
    next(err);
  }
}

export async function getSubscriptionStatus(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return res.status(404).json({ error: 'No subscription found' });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function cancelMySubscription(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) return res.status(404).json({ error: 'No subscription found' });

    await cancelSubscription(data.stripe_subscription_id);

    res.json({ status: 'cancellation_requested' });
  } catch (err) {
    next(err);
  }
}