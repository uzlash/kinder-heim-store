/**
 * Format a number as price with at most 2 decimal places.
 * e.g. 10.5 → "10.50", 10 → "10.00"
 */
export function formatPrice(amount: number): string {
  return Number(amount).toFixed(2);
}
