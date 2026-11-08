import type {
  FarmerProfile,
  Market,
  NetEarningsResult,
  StorageFacility,
  Recommendation,
  AgentStep,
} from './types';
import { MARKETS, STORAGE_FACILITIES } from './demoData';
import {
  computeAllMarkets,
  bestByNetEarnings,
  buildStorageComparison,
} from './calc';
import { formatINR, formatKm } from './format';

export interface DecisionContext {
  farmer: FarmerProfile;
  markets: Market[];
  earnings: NetEarningsResult[];
  best: NetEarningsResult;
  storageFacility: StorageFacility | null;
  storage: ReturnType<typeof buildStorageComparison> | null;
  recommendation: Recommendation | null;
}

export interface AgentDef {
  id: string;
  name: string;
  role: string;
  icon: string; // lucide name
  order: number;
}

export const AGENTS: AgentDef[] = [
  { id: 'context', name: 'Farmer Context Agent', role: 'Understands farmer, crop, location & language', icon: 'UserRound', order: 0 },
  { id: 'market', name: 'Market Intelligence Agent', role: 'Compares market prices & trends', icon: 'LineChart', order: 1 },
  { id: 'logistics', name: 'Logistics Intelligence Agent', role: 'Calculates distances & transport costs', icon: 'Truck', order: 2 },
  { id: 'storage', name: 'Storage Intelligence Agent', role: 'Explores storage & wait scenarios', icon: 'Warehouse', order: 3 },
  { id: 'decision', name: 'Decision Intelligence Agent', role: 'Combines findings → recommendation', icon: 'BrainCircuit', order: 4 },
];

export function buildContext(farmer: FarmerProfile, quantity?: number): DecisionContext {
  const qty = quantity ?? farmer.quantityQuintals;
  const markets = MARKETS.filter((m) => m.crop === farmer.crop);
  const earnings = computeAllMarkets(markets, { quantity: qty, otherExpenses: 0 });
  const best = bestByNetEarnings(earnings);
  const storageFacility =
    STORAGE_FACILITIES.find((f) => f.district === farmer.district) ?? STORAGE_FACILITIES[0];
  const storage = buildStorageComparison(best, storageFacility, qty);
  const recommendation = buildRecommendation(earnings, best, storage, farmer);
  return { farmer, markets, earnings, best, storageFacility, storage, recommendation };
}

export function buildRecommendation(
  earnings: NetEarningsResult[],
  best: NetEarningsResult,
  storage: ReturnType<typeof buildStorageComparison>,
  farmer: FarmerProfile
): Recommendation {
  const worst = earnings.reduce((w, r) => (r.netEarnings < w.netEarnings ? r : w), earnings[0]);
  const priceLeader = earnings.reduce((p, r) => (r.pricePerQuintal > p.pricePerQuintal ? r : p), earnings[0]);
  const reasons: string[] = [];
  reasons.push(
    `${best.marketName} gives the highest estimated net earnings of ${formatINR(best.netEarnings)} for ${best.quantity} quintals.`
  );
  if (best.marketId !== priceLeader.marketId) {
    reasons.push(
      `Although ${priceLeader.marketName} lists a higher price (₹${priceLeader.pricePerQuintal}/quintal), ${best.marketName} has lower transport (${formatINR(best.transport)}) and expenses, so you keep more money.`
    );
  }
  reasons.push(
    `Expenses considered: transport ${formatINR(best.transport)}, loading ${formatINR(best.loading)}, commission ${formatINR(best.commission)}.`
  );
  const upScenario = storage.storeScenarios.find((s) => s.label === 'Prices rise 20%');
  if (upScenario && upScenario.deltaVsSellNow > 0) {
    reasons.push(
      `If you can wait 7 days and prices rise 20%, storage could yield ${formatINR(upScenario.netEarnings)} — but this is uncertain.`
    );
  }

  const risks: string[] = [
    'Market prices can change daily; these figures are simulated, not live.',
    'Transport costs vary with fuel and vehicle availability.',
    `Selling at ${worst.marketName} would earn about ${formatINR(worst.netEarnings)} — ${formatINR(best.netEarnings - worst.netEarnings)} less.`,
  ];
  if (storage.storeScenarios[0].deltaVsSellNow < 0) {
    risks.push('If prices drop after storage, you could earn less than selling now.');
  }

  const alternatives: string[] = [
    `Sell now at ${best.marketName} for ~${formatINR(best.netEarnings)}.`,
    `Consider ${priceLeader.marketName} if you can absorb higher transport.`,
    `Store 7 days and sell later — only if you expect prices to rise 10%+.`,
  ];

  const dataFresh = marketsAllFresh(earnings.length);
  const confidence: Recommendation['confidence'] = dataFresh ? 'high' : 'medium';
  const confidenceNote = dataFresh
    ? 'Based on complete, recent simulated records across multiple markets.'
    : 'Based on partial simulated records; verify with local mandi before deciding.';

  return {
    marketId: best.marketId,
    marketName: best.marketName,
    netEarnings: best.netEarnings,
    reasons,
    risks,
    alternatives,
    confidence,
    confidenceNote,
  };
}

function marketsAllFresh(count: number): boolean {
  return count >= 3;
}

export function agentStepsFor(ctx: DecisionContext): AgentStep[] {
  const f = ctx.farmer;
  return [
    {
      id: 'context',
      label: 'Farmer Context Agent',
      status: 'completed',
      summary: `Identified ${f.name}, ${f.district}, ${f.crop} (${f.quantityQuintals} quintals).`,
      output: [
        `Farmer: ${f.name}`,
        `District: ${f.district}`,
        `Crop: ${f.crop}`,
        `Quantity: ${f.quantityQuintals} quintals`,
        `Language: ${f.lang}`,
      ],
    },
    {
      id: 'market',
      label: 'Market Intelligence Agent',
      status: 'completed',
      summary: `Compared ${ctx.markets.length} markets. Price range ₹${Math.min(...ctx.markets.map((m) => m.pricePerQuintal))}–₹${Math.max(...ctx.markets.map((m) => m.pricePerQuintal))}/quintal.`,
      output: ctx.markets.map(
        (m) => `${m.name}: ₹${m.pricePerQuintal}/q (${m.trend})`
      ),
    },
    {
      id: 'logistics',
      label: 'Logistics Intelligence Agent',
      status: 'completed',
      summary: `Transport ranges ${formatINR(Math.min(...ctx.markets.map((m) => m.transportCost)))}–${formatINR(Math.max(...ctx.markets.map((m) => m.transportCost)))} for ${formatKm(0)}–${Math.max(...ctx.markets.map((m) => m.distanceKm))} km.`,
      output: ctx.markets.map(
        (m) => `${m.name}: ${m.distanceKm} km, transport ${formatINR(m.transportCost)}`
      ),
    },
    {
      id: 'storage',
      label: 'Storage Intelligence Agent',
      status: 'completed',
      summary: ctx.storageFacility
        ? `${ctx.storageFacility.name}: ₹${ctx.storageFacility.chargePerQuintalPerDay}/q/day.`
        : 'No storage facility found.',
      output: ctx.storage
        ? ctx.storage.storeScenarios.map(
            (s) => `${s.label}: net ${formatINR(s.netEarnings)} (Δ ${formatINR(s.deltaVsSellNow)})`
          )
        : [],
    },
    {
      id: 'decision',
      label: 'Decision Intelligence Agent',
      status: 'completed',
      summary: ctx.recommendation
        ? `Recommend ${ctx.recommendation.marketName} → ~${formatINR(ctx.recommendation.netEarnings)}.`
        : 'No recommendation.',
      output: ctx.recommendation ? ctx.recommendation.reasons : [],
    },
  ];
}

// Per-agent detailed structured result for the orchestration UI
export interface AgentDetail {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
  calculations: { label: string; value: string }[];
}

export function agentDetails(ctx: DecisionContext): AgentDetail[] {
  const f = ctx.farmer;
  return [
    {
      id: 'context',
      name: 'Farmer Context Agent',
      inputs: ['Onboarding profile', 'Preferred language'],
      outputs: [`${f.name} • ${f.district}`, `${f.crop} • ${f.quantityQuintals} quintals`],
      calculations: [
        { label: 'Language', value: f.lang.toUpperCase() },
        { label: 'Harvest date', value: f.harvestDate },
      ],
    },
    {
      id: 'market',
      name: 'Market Intelligence Agent',
      inputs: [`${ctx.markets.length} candidate markets`],
      outputs: ctx.markets.map((m) => `₹${m.pricePerQuintal}/q — ${m.name}`),
      calculations: [
        { label: 'Highest price', value: `₹${Math.max(...ctx.markets.map((m) => m.pricePerQuintal))}/q` },
        { label: 'Lowest price', value: `₹${Math.min(...ctx.markets.map((m) => m.pricePerQuintal))}/q` },
      ],
    },
    {
      id: 'logistics',
      name: 'Logistics Intelligence Agent',
      inputs: ctx.markets.map((m) => `${m.name}: ${m.distanceKm} km`),
      outputs: ctx.markets.map((m) => `Transport ${formatINR(m.transportCost)} + loading ${formatINR(m.loadingCost)}`),
      calculations: [
        { label: 'Nearest', value: `${Math.min(...ctx.markets.map((m) => m.distanceKm))} km` },
        { label: 'Farthest', value: `${Math.max(...ctx.markets.map((m) => m.distanceKm))} km` },
      ],
    },
    {
      id: 'storage',
      name: 'Storage Intelligence Agent',
      inputs: [ctx.storageFacility?.name ?? '—'],
      outputs: ctx.storage?.storeScenarios.map((s) => `${s.label}: ${formatINR(s.netEarnings)}`) ?? [],
      calculations: ctx.storageFacility
        ? [
            { label: 'Rate', value: `₹${ctx.storageFacility.chargePerQuintalPerDay}/q/day` },
            { label: '7-day cost', value: formatINR(ctx.storageFacility.chargePerQuintalPerDay * f.quantityQuintals * 7) },
          ]
        : [],
    },
    {
      id: 'decision',
      name: 'Decision Intelligence Agent',
      inputs: ['All agent outputs'],
      outputs: ctx.recommendation ? [`${ctx.recommendation.marketName}: ${formatINR(ctx.recommendation.netEarnings)}`] : [],
      calculations: [
        { label: 'Best net', value: formatINR(ctx.best.netEarnings) },
        { label: 'Confidence', value: ctx.recommendation?.confidence ?? '—' },
      ],
    },
  ];
}
