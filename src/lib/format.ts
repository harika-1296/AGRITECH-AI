import type { Currency } from './types';

export function formatINR(n: Currency): string {
  // Indian grouping with rupee sign
  const sign = n < 0 ? '-' : '';
  const abs = Math.round(Math.abs(n));
  const str = abs.toString();
  let last3 = str.slice(-3);
  const other = str.slice(0, -3);
  const grouped = other ? other.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
  return `${sign}₹${grouped}`;
}

export function formatINRShort(n: Currency): string {
  if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (Math.abs(n) >= 1000) return `₹${(n / 1000).toFixed(1)}k`;
  return formatINR(n);
}

export function formatKm(n: number): string {
  return `${n} km`;
}

export function classNames(...c: (string | false | undefined | null)[]): string {
  return c.filter(Boolean).join(' ');
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
