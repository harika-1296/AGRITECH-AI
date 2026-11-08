export type Lang = 'te' | 'en' | 'hi';

export type Currency = number; // INR

export interface FarmerProfile {
  name: string;
  district: string;
  lang: Lang;
  crop: string;
  quantityQuintals: number;
  harvestDate: string;
  onboarded: boolean;
}

export interface Market {
  id: string;
  name: string;
  district: string;
  crop: string;
  pricePerQuintal: number;
  distanceKm: number;
  transportCost: number;
  loadingCost: number;
  commissionPct: number; // % of gross
  updatedAt: string;
  source: 'simulated';
  suitability: 'high' | 'medium' | 'low';
  lat: number;
  lng: number;
  trend: 'up' | 'down' | 'stable';
}

export interface StorageFacility {
  id: string;
  name: string;
  district: string;
  type: 'Cold Storage' | 'Warehouse' | 'Shade Net';
  capacityTons: number | null;
  chargePerQuintalPerDay: number;
  distanceKm: number;
  verified: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface NetEarningsResult {
  marketId: string;
  marketName: string;
  grossRevenue: number;
  transport: number;
  loading: number;
  commission: number;
  other: number;
  totalExpenses: number;
  netEarnings: number;
  pricePerQuintal: number;
  quantity: number;
}

export interface StorageScenario {
  label: string;
  futurePricePerQuintal: number;
  storageDays: number;
  storageCost: number;
  extraTransport: number;
  netEarnings: number;
  deltaVsSellNow: number;
}

export interface AgentStep {
  id: string;
  label: string;
  status: 'waiting' | 'analyzing' | 'processing' | 'completed';
  summary: string;
  output: string[];
}

export interface Recommendation {
  marketId: string;
  marketName: string;
  netEarnings: number;
  reasons: string[];
  risks: string[];
  alternatives: string[];
  confidence: 'high' | 'medium' | 'low';
  confidenceNote: string;
}

export interface ChatMessage {
  id: string;
  role: 'farmer' | 'assistant';
  text: string;
  lang: Lang;
  timestamp: number;
}

export type PageKey =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'voice'
  | 'agents'
  | 'market'
  | 'calculator'
  | 'storage'
  | 'recommendation'
  | 'profile';
