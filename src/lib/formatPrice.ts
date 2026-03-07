export function formatPrice(amount: number): string {
  const num = Number(amount);
  if (!Number.isFinite(num)) return "0.00";

  return num.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
