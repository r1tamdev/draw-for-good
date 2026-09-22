import { stripe } from '../config/stripe.js';
import { env } from '../config/env.js';

const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  yearly: process.env.STRIPE_PRICE_YEARLY,
};

export async function createCheckoutSession(userId, plan, email) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
    success_url: `${env.clientUrl}/dashboard?checkout=success`,
    cancel_url: `${env.clientUrl}/subscribe?checkout=cancelled`,
    metadata: { userId, plan },
  });

  return session;
}

export async function cancelSubscription(stripeSubscriptionId) {
  return stripe.subscriptions.cancel(stripeSubscriptionId);
}

export function constructWebhookEvent(rawBody, signature) {
  return stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
}