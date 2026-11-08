import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  Mic, Store, Calculator, Warehouse, TrendingUp, MapPin, Sprout, Scale,
  ArrowRight, Sparkles, Zap, ChevronRight, BadgeCheck, Clock,
} from 'lucide-react';
import { useApp } from '@/lib/appContext';
import { buildContext } from '@/lib/agents';
import { PRICE_TRENDS } from '@/lib/demoData';
import { t, langNative } from '@/lib/i18n';
import { formatINR, formatKm } from '@/lib/format';
import { Card, Stat, Chip, SimBadge, SectionTitle } from '@/components/ui';
import type { PageKey } from '@/lib/types';

export function DashboardPage() {
  const { farmer, setPage, lang } = useApp();
  const ctx = buildContext(farmer);
  const best = ctx.best;
  const priceLeader = ctx.earnings.reduce((p, r) => (r.pricePerQuintal > p.pricePerQuintal ? r : p), ctx.earnings[0]);

  return (
    <div className="space-y-6 py-6">
      {/* Welcome */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-forest-500">
            <Sparkles size={16} className="text-forest-400" /> {t('nav_dashboard', lang)}
          </div>
          <h1 className="mt-1 font-display text-2xl md:text-3xl font-extrabold text-forest-900">
            {lang === 'te' ? `స్వాగతం, ${farmer.name}` : lang === 'hi' ? `स्वागत है, ${farmer.name}` : `Welcome, ${farmer.name}`}
          </h1>
          <p className="mt-1 text-sm text-forest-600">
            {farmer.district}, Telangana • {langNative(lang)}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPage('voice')} className="btn-primary">
            <Mic size={18} /> {t('ask_ai', lang)}
          </button>
          <button onClick={() => setPage('agents')} className="btn-secondary">
            <Zap size={18} /> {t('run_demo', lang)}
          </button>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <Stat label="Your Crop" value={farmer.crop} sub={`${farmer.quantityQuintals} quintals`} icon={<Sprout size={20} />} accent="green" />
        </Card>
        <Card className="p-5">
          <Stat label="Current Price" value={`₹${best.pricePerQuintal}/q`} sub="Indicative • simulated" icon={<TrendingUp size={20} />} accent="lime" />
        </Card>
        <Card className="p-5">
          <Stat label="Best Net Return" value={formatINR(best.netEarnings)} sub={best.marketName} icon={<BadgeCheck size={20} />} accent="green" />
        </Card>
        <Card className="p-5">
          <Stat label="Storage Near You" value={ctx.storageFacility?.name.split(' ').slice(0, 2).join(' ') ?? '—'} sub={ctx.storageFacility ? `₹${ctx.storageFacility.chargePerQuintalPerDay}/q/day` : ''} icon={<Warehouse size={20} />} accent="green" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend chart */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-forest-900">Tomato price trend</h3>
              <p className="text-xs text-forest-500">6-week indicative trend • Warangal基准</p>
            </div>
            <SimBadge />
          </div>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PRICE_TRENDS} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4C9B64" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#4C9B64" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7F1DF" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#4C9B64' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#4C9B64' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E7F1DF', fontSize: 13 }}
                  formatter={(v) => [`₹${v}/quintal`, 'Price']}
                />
                <Area type="monotone" dataKey="price" stroke="#267348" strokeWidth={2.5} fill="url(#gPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Harvest decision */}
        <Card className="p-5">
          <h3 className="font-display font-bold text-forest-900">Your Harvest Decision</h3>
          <p className="text-xs text-forest-500">Three strategies to consider</p>
          <div className="mt-4 space-y-3">
            {STRATEGIES.map((s, i) => (
              <button
                key={s.title}
                onClick={() => setPage(s.page)}
                className="group flex w-full items-center gap-3 rounded-xl border border-forest-50 bg-cream-50/50 p-3 text-left transition hover:border-forest-200 hover:bg-forest-50"
              >
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.bg} ${s.fg}`}>
                  <s.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-forest-400">0{i + 1}</span>
                    <span className="font-display text-sm font-bold text-forest-900">{s.title}</span>
                  </div>
                  <p className="text-xs text-forest-500 leading-snug">{s.desc}</p>
                </div>
                <ChevronRight size={16} className="text-forest-300 transition group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Top markets + recommendation preview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-forest-900">Top market opportunities</h3>
            <button onClick={() => setPage('market')} className="btn-ghost text-xs">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {ctx.earnings.slice(0, 3).sort((a, b) => b.netEarnings - a.netEarnings).map((r, i) => {
              const market = ctx.markets.find((m) => m.id === r.marketId)!;
              const isBest = r.marketId === best.marketId;
              return (
                <div
                  key={r.marketId}
                  className={`flex items-center gap-4 rounded-xl p-3.5 ${isBest ? 'bg-forest-50 ring-1 ring-forest-200' : 'bg-cream-50/50'}`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-forest-900 text-sm font-bold text-forest-200">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold text-forest-900 text-sm">{r.marketName}</span>
                      {isBest && <Chip tone="green">Best net</Chip>}
                    </div>
                    <div className="text-xs text-forest-500">{market.district} • {formatKm(market.distanceKm)} • ₹{r.pricePerQuintal}/q</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-forest-900">{formatINR(r.netEarnings)}</div>
                    <div className="text-[10px] text-forest-500">net earnings</div>
                  </div>
                </div>
              );
            })}
          </div>
          {best.marketId !== priceLeader.marketId && (
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
              <strong>Note:</strong> {priceLeader.marketName} lists the highest price (₹{priceLeader.pricePerQuintal}/q), but {best.marketName} gives higher net earnings after transport.
            </div>
          )}
        </Card>

        {/* AI rec preview */}
        <Card className="flex flex-col p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-forest-400" />
            <h3 className="font-display font-bold text-forest-900">AI Recommendation</h3>
          </div>
          <div className="mt-4 flex-1 rounded-xl bg-gradient-to-br from-forest-900 to-forest-700 p-4 text-white">
            <div className="text-xs font-semibold uppercase tracking-wide text-forest-200/70">Your best selling opportunity</div>
            <div className="mt-1 font-display text-lg font-bold">{ctx.recommendation?.marketName}</div>
            <div className="mt-3 text-3xl font-extrabold">{formatINR(ctx.recommendation?.netEarnings ?? 0)}</div>
            <div className="text-xs text-forest-100/60">estimated net earnings</div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <Clock size={14} className="text-forest-200" />
              <span className="text-forest-100/70">Confidence: {ctx.recommendation?.confidence}</span>
            </div>
          </div>
          <button onClick={() => setPage('recommendation')} className="btn-primary mt-4 w-full">
            View full recommendation <ArrowRight size={16} />
          </button>
        </Card>
      </div>
    </div>
  );
}

const STRATEGIES: { icon: typeof Store; title: string; desc: string; page: PageKey; bg: string; fg: string }[] = [
  { icon: Store, title: 'Sell immediately', desc: 'Lock in current prices at the best net-return market.', page: 'recommendation', bg: 'bg-forest-100', fg: 'text-forest-600' },
  { icon: MapPin, title: 'Compare other markets', desc: 'See if a nearby market beats your local one after costs.', page: 'market', bg: 'bg-forest-200/40', fg: 'text-forest-700' },
  { icon: Warehouse, title: 'Explore storage & sell later', desc: 'Weigh storage cost against possible future prices.', page: 'storage', bg: 'bg-forest-100', fg: 'text-forest-600' },
];
