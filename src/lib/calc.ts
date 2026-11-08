import type { Market, NetEarningsResult, StorageFacility, StorageScenario } from './types';
import { formatINR, formatKm } from './format';

export interface CalcInput {
  quantity: number;
  otherExpenses: number;
}

export function computeNetEarnings(market: Market, input: CalcInput): NetEarningsResult {
  const grossRevenue = market.pricePerQuintal * input.quantity;
  const commission = Math.round((grossRevenue * market.commissionPct) / 100);
  const totalExpenses =
    market.transportCost + market.loadingCost + commission + input.otherExpenses;
  const netEarnings = grossRevenue - totalExpenses;
  return {
    marketId: market.id,
    marketName: market.name,
    grossRevenue,
    transport: market.transportCost,
    loading: market.loadingCost,
    commission,
    other: input.otherExpenses,
    totalExpenses,
    netEarnings,
    pricePerQuintal: market.pricePerQuintal,
    quantity: input.quantity,
  };
}

export function computeAllMarkets(
  markets: Market[],
  input: CalcInput
): NetEarningsResult[] {
  return markets.map((m) => computeNetEarnings(m, input));
}

export function bestByNetEarnings(results: NetEarningsResult[]): NetEarningsResult {
  return results.reduce((best, r) => (r.netEarnings > best.netEarnings ? r : best), results[0]);
}

export function sortByPriceDesc(results: NetEarningsResult[]): NetEarningsResult[] {
  return [...results].sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
}

export function sortByTransportAsc(results: NetEarningsResult[]): NetEarningsResult[] {
  return [...results].sort((a, b) => a.transport - b.transport);
}

export function sortByNetDesc(results: NetEarningsResult[]): NetEarningsResult[] {
  return [...results].sort((a, b) => b.netEarnings - a.netEarnings);
}

export interface StorageComparison {
  sellNow: NetEarningsResult;
  storeScenarios: StorageScenario[];
}

export function buildStorageComparison(
  bestNow: NetEarningsResult,
  facility: StorageFacility,
  quantity: number
): StorageComparison {
  const storageDays = 7;
  const baseStorageCost = facility.chargePerQuintalPerDay * quantity * storageDays;
  const extraTransport = Math.round(facility.distanceKm * 7 * (quantity / 50));

  const scenarios: { label: string; pct: number }[] = [
    { label: 'Prices drop 10%', pct: -10 },
    { label: 'Prices stay flat', pct: 0 },
    { label: 'Prices rise 10%', pct: 10 },
    { label: 'Prices rise 20%', pct: 20 },
  ];

  const storeScenarios: StorageScenario[] = scenarios.map((s) => {
    const futurePrice = Math.round(bestNow.pricePerQuintal * (1 + s.pct / 100));
    const gross = futurePrice * quantity;
    const sellNowExpenses = bestNow.transport + bestNow.loading + bestNow.commission + bestNow.other;
    const net = gross - sellNowExpenses - baseStorageCost - extraTransport;
    return {
      label: s.label,
      futurePricePerQuintal: futurePrice,
      storageDays,
      storageCost: baseStorageCost,
      extraTransport,
      netEarnings: net,
      deltaVsSellNow: net - bestNow.netEarnings,
    };
  });

  return { sellNow: bestNow, storeScenarios };
}

export function explainEarnings(r: NetEarningsResult): string {
  return `${r.marketName}: Gross ${formatINR(r.grossRevenue)} − expenses ${formatINR(
    r.totalExpenses
  )} = net ${formatINR(r.netEarnings)}.`;
}

export function explainTransportEdge(
  higher: NetEarningsResult,
  lower: NetEarningsResult
): string {
  const priceGap = higher.pricePerQuintal - lower.pricePerQuintal;
  const expenseGap =
    higher.transport + higher.loading + higher.commission - (lower.transport + lower.loading + lower.commission);
  return `${higher.marketName} offers ₹${priceGap}/quintal more, but its expenses are ${formatINR(
    expenseGap
  )} higher (${formatKm(0)} extra transport). Net result favours ${lower.marketName}.`;
}
