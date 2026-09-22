import { supabaseAdmin } from '../config/supabase.js';
import { stripe } from '../config/stripe.js';
import { constructWebhookEvent } from '../services/stripe.js';

function mapStripeStatus(status) {
  if (
    status === 'active' ||
    status === 'trialing'
  ) {
    return 'active';
  }

  if (status === 'canceled') {
    return 'cancelled';
  }

  return 'lapsed';
}

function periodEnd(subscription) {
  return subscription.current_period_end
    ? new Date(
        subscription.current_period_end *
          1000,
      ).toISOString()
    : null;
}

export async function handleStripeWebhook(
  req,
  res,
) {
  const signature =
    req.headers['stripe-signature'];

  let event;

  try {
    event =
      constructWebhookEvent(
        req.body,
        signature,
      );
  } catch (error) {
    console.error(
      'Stripe signature error:',
      error,
    );

    return res.status(400).json({
      error:
        'Webhook signature verification failed',
    });
  }

  try {
    if (
      event.type ===
      'checkout.session.completed'
    ) {
      const session =
        event.data.object;

      const {
        userId,
        plan,
      } =
        session.metadata || {};

      if (
        !userId ||
        !session.subscription
      ) {
        return res.status(400).json({
          error:
            'Missing checkout metadata',
        });
      }

      const stripeSubscription =
        await stripe.subscriptions.retrieve(
          session.subscription,
        );

      const {
        data: profile,
      } =
        await supabaseAdmin
          .from('profiles')
          .select(
            'selected_charity_id, onboarding_contribution_pct',
          )
          .eq('id', userId)
          .single();

      const { error } =
        await supabaseAdmin
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              plan,
              status:
                mapStripeStatus(
                  stripeSubscription.status,
                ),
              stripe_subscription_id:
                stripeSubscription.id,

              charity_id:
                profile?.selected_charity_id ||
                null,

              charity_contribution_pct:
                profile
                  ?.onboarding_contribution_pct ||
                10,

              current_period_end:
                periodEnd(
                  stripeSubscription,
                ),

              cancel_at_period_end:
                Boolean(
                  stripeSubscription.cancel_at_period_end,
                ),
            },
            {
              onConflict:
                'stripe_subscription_id',
            },
          );

      if (error) throw error;
    }

    if (
      event.type ===
      'customer.subscription.updated'
    ) {
      const subscription =
        event.data.object;

      const { error } =
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status:
              mapStripeStatus(
                subscription.status,
              ),

            current_period_end:
              periodEnd(subscription),

            cancel_at_period_end:
              Boolean(
                subscription.cancel_at_period_end,
              ),
          })
          .eq(
            'stripe_subscription_id',
            subscription.id,
          );

      if (error) throw error;
    }

    if (
      event.type ===
      'customer.subscription.deleted'
    ) {
      const subscription =
        event.data.object;

      const { error } =
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'cancelled',

            current_period_end:
              periodEnd(subscription),

            cancel_at_period_end:
              false,
          })
          .eq(
            'stripe_subscription_id',
            subscription.id,
          );

      if (error) throw error;
    }

    return res.json({
      received: true,
    });
  } catch (error) {
    console.error(
      'Stripe webhook error:',
      error,
    );

    return res.status(500).json({
      error:
        'Webhook processing failed',
    });
  }
}