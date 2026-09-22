export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString();
}