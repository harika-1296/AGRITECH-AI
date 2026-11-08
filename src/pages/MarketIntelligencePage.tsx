import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Minus, MapPin, Truck, BadgeCheck, Star, Store, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '@/lib/appContext';
import { MARKETS, PRICE_TRENDS_BY_MARKET } from '@/lib/demoData';
import { computeAllMarkets, bestByNetEarnings, sortByNetDesc, sortByPriceDesc, sortByTransportAsc } from '@/lib/calc';
import { formatINR, formatKm, classNames } from '@/lib/format';
import { Card, Chip, SimBadge, SectionTitle, EmptyState } from '@/components/ui';
import type { Market, NetEarningsResult } from '@/lib/types';

type SortKey = 'net' | 'price' | 'transport';

export function MarketIntelligencePage() {
  const { farmer } = useApp();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('net');
  const [suitFilter, setSuitFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selected, setSelected] = useState<string[]>([]);

  const allResults = useMemo(
    () => computeAllMarkets(MARKETS, { quantity: farmer.quantityQuintals, otherExpenses: 0 }),
    [farmer.quantityQuintals]
  );

  const filtered = useMemo(() => {
    let r = allResults;
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((res) => {
        const m = MARKETS.find((x) => x.id === res.marketId)!;
        return m.name.toLowerCase().includes(q) || m.district.toLowerCase().includes(q);
      });
    }
    if (suitFilter !== 'all') {
      r = r.filter((res) => MARKETS.find((x) => x.id === res.marketId)?.suitability === suitFilter);
    }
    if (sort === 'net') r = sortByNetDesc(r);
    if (sort === 'price') r = sortByPriceDesc(r);
    if (sort === 'transport') r = sortByTransportAsc(r);
    return r;
  }, [allResults, search, sort, suitFilter]);

  const best = bestByNetEarnings(allResults);
  const priceLeader = allResults.reduce((p, r) => (r.pricePerQuintal > p.pricePerQuintal ? r : p), allResults[0]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev));
  };

  const selectedResults = selected.map((id) => allResults.find((r) => r.marketId === id)!).filter(Boolean);

  return (
    <div className="space-y-6 py-6">
      <SectionTitle
        eyebrow="Market Intelligence"
        title="Compare Telangana tomato markets"
        desc="Search, filter and sort by price, transport cost or estimated net earnings. The best net-return option is highlighted — it may not be the highest listed price."
      />

      {/* Best callout */}
      <Card className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between" >
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-200 text-forest-900">
            <Star size={26} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-forest-400">Best net earnings</div>
            <div className="font-display text-lg font-bold text-forest-900">{best.marketName}</div>
            <div className="text-sm text-forest-600">{formatINR(best.netEarnings)} after all expenses</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SimBadge />
          <Chip tone="lime"><Clock size={10} /> Updated today</Chip>
        </div>
      </Card>

      {best.marketId !== priceLeader.marketId && (
        <div className="rounded-xl bg-amber-50 p-3.5 text-sm text-amber-800">
          <strong>Insight:</strong> {priceLeader.marketName} lists the highest price (₹{priceLeader.pricePerQuintal}/quintal), but after {formatINR(priceLeader.transport)} transport you net only {formatINR(priceLeader.netEarnings)}. {best.marketName} nets {formatINR(best.netEarnings - priceLeader.netEarnings)} more despite a lower listing.
        </div>
      )}

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              className="input-field pl-10"
              placeholder="Search market or district…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {(['net', 'price', 'transport'] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={classNames(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition',
                  sort === k ? 'bg-forest-600 text-white' : 'bg-forest-50 text-forest-600 hover:bg-forest-100'
                )}
              >
                <ArrowUpDown size={14} /> {k === 'net' ? 'Net earnings' : k === 'price' ? 'Highest price' : 'Lowest transport'}
              </button>
            ))}
          </div>
          <select
            className="input-field md:w-44"
            value={suitFilter}
            onChange={(e) => setSuitFilter(e.target.value as typeof suitFilter)}
          >
            <option value="all">All suitability</option>
            <option value="high">High suitability</option>
            <option value="medium">Medium suitability</option>
            <option value="low">Low suitability</option>
          </select>
        </div>
      </Card>

      {/* Market cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const m = MARKETS.find((x) => x.id === r.marketId)!;
          const isBest = r.marketId === best.marketId;
          const isPriceLeader = r.marketId === priceLeader.marketId;
          const isSelected = selected.includes(r.marketId);
          return (
            <Card
              key={r.marketId}
              className={classNames(
                'p-5 cursor-pointer transition hover:shadow-cardLg',
                isBest && 'ring-2 ring-forest-200',
                isSelected && 'ring-2 ring-forest-400'
              )}
            >
              <div onClick={() => toggleSelect(r.marketId)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-600">
                      <Store size={20} />
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-forest-900 leading-tight">{m.name}</div>
                      <div className="text-xs text-forest-500 flex items-center gap-1"><MapPin size={11} /> {m.district}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isBest && <Chip tone="green">Best net</Chip>}
                    {isPriceLeader && !isBest && <Chip tone="lime">Top price</Chip>}
                    <SuitChip s={m.suitability} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-forest-400">Price / quintal</div>
                    <div className="flex items-center gap-1.5 font-bold text-forest-900">
                      ₹{r.pricePerQuintal}
                      <TrendIcon t={m.trend} />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-forest-400">Distance</div>
                    <div className="font-bold text-forest-900">{formatKm(m.distanceKm)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-forest-400">Transport</div>
                    <div className="font-bold text-forest-900 flex items-center gap-1"><Truck size={12} className="text-forest-400" /> {formatINR(m.transportCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-forest-400">Net earnings</div>
                    <div className={classNames('font-extrabold', isBest ? 'text-forest-600' : 'text-forest-900')}>{formatINR(r.netEarnings)}</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-forest-400">
                  <span>Updated {m.updatedAt}</span>
                  <span>Commission {m.commissionPct}%</span>
                </div>
                {isSelected && <div className="mt-2 text-xs font-bold text-forest-600">✓ Selected for comparison</div>}
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={<Search size={24} />} title="No markets found" desc="Try changing your search or filters." />
      )}

      {/* Comparison table */}
      <Card className="p-5 overflow-x-auto">
        <h3 className="font-display font-bold text-forest-900 mb-3">Full comparison table</h3>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wide text-forest-400 border-b border-forest-50">
              <th className="py-2.5 pr-4">Market</th>
              <th className="py-2.5 pr-4">District</th>
              <th className="py-2.5 pr-4 text-right">Price/q</th>
              <th className="py-2.5 pr-4 text-right">Distance</th>
              <th className="py-2.5 pr-4 text-right">Transport</th>
              <th className="py-2.5 pr-4 text-right">Net earnings</th>
              <th className="py-2.5">Suitability</th>
            </tr>
          </thead>
          <tbody>
            {sortByNetDesc(filtered).map((r) => {
              const m = MARKETS.find((x) => x.id === r.marketId)!;
              const isBest = r.marketId === best.marketId;
              return (
                <tr key={r.marketId} className={classNames('border-b border-forest-50 last:border-0', isBest && 'bg-forest-50/50')}>
                  <td className="py-3 pr-4 font-semibold text-forest-900">{m.name}{isBest && <span className="ml-1 text-forest-500">★</span>}</td>
                  <td className="py-3 pr-4 text-forest-600">{m.district}</td>
                  <td className="py-3 pr-4 text-right font-semibold">₹{r.pricePerQuintal}</td>
                  <td className="py-3 pr-4 text-right text-forest-600">{m.distanceKm} km</td>
                  <td className="py-3 pr-4 text-right text-forest-600">{formatINR(m.transportCost)}</td>
                  <td className="py-3 pr-4 text-right font-bold text-forest-900">{formatINR(r.netEarnings)}</td>
                  <td className="py-3"><SuitChip s={m.suitability} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Selected comparison + chart + map */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trend chart for selected or best */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-forest-900 mb-1">Price trend comparison</h3>
          <p className="text-xs text-forest-500 mb-4">6-week simulated trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRICE_TRENDS_BY_MARKET[Object.keys(PRICE_TRENDS_BY_MARKET)[0]]} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {['hyd', 'wg', 'krm'].map((id, i) => (
                    <linearGradient key={id} id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={TREND_COLORS[i]} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={TREND_COLORS[i]} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7F1DF" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#4C9B64' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#4C9B64' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7F1DF', fontSize: 12 }} formatter={(v) => `₹${v}/q`} />
                {['hyd', 'wg', 'krm'].map((id, i) => (
                  <Area key={id} type="monotone" dataKey="price" stroke={TREND_COLORS[i]} strokeWidth={2} fill={`url(#g${id})`} name={MARKETS.find((m) => m.id === id)!.name.split(' ')[0]} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {['hyd', 'wg', 'krm'].map((id, i) => (
              <div key={id} className="flex items-center gap-1.5 text-xs text-forest-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TREND_COLORS[i] }} />
                {MARKETS.find((m) => m.id === id)!.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </Card>

        {/* Map panel */}
        <MapPanel markets={MARKETS} bestId={best.marketId} />
      </div>

      {/* Side by side comparison bars */}
      {selectedResults.length >= 2 && (
        <Card className="p-5">
          <h3 className="font-display font-bold text-forest-900 mb-4">Side-by-side: {selectedResults.length} markets</h3>
          <div className="space-y-4">
            {selectedResults.map((r) => {
              const m = MARKETS.find((x) => x.id === r.marketId)!;
              const maxNet = Math.max(...selectedResults.map((x) => x.netEarnings));
              const pct = (r.netEarnings / maxNet) * 100;
              return (
                <div key={r.marketId}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-forest-900">{m.name}</span>
                    <span className="font-bold text-forest-900">{formatINR(r.netEarnings)}</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-forest-50 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-forest-400">
                    <span>Gross {formatINR(r.grossRevenue)}</span>
                    <span>Expenses {formatINR(r.totalExpenses)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

const TREND_COLORS = ['#267348', '#B7D96A', '#4C9B64'];

function SuitChip({ s }: { s: Market['suitability'] }) {
  if (s === 'high') return <Chip tone="green"><BadgeCheck size={10} /> High</Chip>;
  if (s === 'medium') return <Chip tone="amber">Medium</Chip>;
  return <Chip tone="neutral">Low</Chip>;
}

function TrendIcon({ t }: { t: Market['trend'] }) {
  if (t === 'up') return <TrendingUp size={13} className="text-forest-500" />;
  if (t === 'down') return <TrendingDown size={13} className="text-rose-500" />;
  return <Minus size={13} className="text-forest-300" />;
}

function MapPanel({ markets, bestId }: { markets: Market[]; bestId: string }) {
  // Convincing stylised Telangana map panel with labelled demo locations
  const points = markets.map((m) => {
    // map lat/lng to approximate positions in a 0-100 grid
    const x = ((m.lng - 77.5) / 3.5) * 100;
    const y = (1 - (m.lat - 16.5) / 3) * 100;
    return { ...m, x: Math.max(8, Math.min(92, x)), y: Math.max(12, Math.min(88, y)) };
  });

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-forest-900">Market discovery map</h3>
        <SimBadge />
      </div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-forest-50 to-cream-50 bg-dots">
        {/* Stylised Telangana outline */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path
            d="M15,25 Q22,12 38,15 Q55,10 68,20 Q82,18 88,32 Q92,48 84,62 Q78,78 62,82 Q45,88 30,80 Q12,72 12,55 Q10,38 15,25 Z"
            fill="rgba(76,155,100,0.06)"
            stroke="rgba(38,115,72,0.25)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>
        {points.map((p) => {
          const isBest = p.id === bestId;
          return (
            <div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <div className={classNames(
                'flex flex-col items-center gap-1',
                isBest && 'z-10'
              )}>
                <div className={classNames(
                  'rounded-full transition',
                  isBest ? 'h-5 w-5 bg-forest-200 ring-4 ring-forest-200/30 animate-pulse'
                  : p.suitability === 'high' ? 'h-3.5 w-3.5 bg-forest-500'
                  : 'h-3 w-3 bg-forest-300'
                )} />
                <div className={classNames(
                  'whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-bold leading-none',
                  isBest ? 'bg-forest-900 text-white' : 'bg-white/80 text-forest-700 border border-forest-50'
                )}>
                  {p.name.split(' ')[0]}
                </div>
                <div className="text-[8px] text-forest-500">₹{p.pricePerQuintal}/q</div>
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-2 left-2 rounded-lg bg-white/80 px-2 py-1 text-[9px] font-semibold text-forest-600">
          Telangana • Simulated locations
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-forest-600">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-forest-200" /> Best net</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-forest-500" /> High suitability</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-forest-300" /> Other</span>
      </div>
    </Card>
  );
}
