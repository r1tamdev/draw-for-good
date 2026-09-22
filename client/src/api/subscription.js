import axiosInstance from './axiosInstance.js';

export async function createSubscription(plan) {
  const { data } = await axiosInstance.post('/subscriptions', { plan });
  return data;
}

export async function getSubscriptionStatus() {
  const { data } = await axiosInstance.get('/subscriptions/status');
  return data;
}

export async function cancelSubscription() {
  const { data } = await axiosInstance.post('/subscriptions/cancel');
  return data;
}