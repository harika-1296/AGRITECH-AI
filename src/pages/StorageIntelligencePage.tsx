import { useState, useMemo } from 'react';
import {
  Warehouse, Snowflake, Building2, Tent, MapPin, BadgeCheck, AlertTriangle,
  TrendingUp, TrendingDown, Minus, ArrowRight, Clock, Scale, Calculator,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { useApp } from '@/lib/appContext';
import { STORAGE_FACILITIES } from '@/lib/demoData';
import { buildContext } from '@/lib/agents';
import { formatINR, formatKm, classNames } from '@/lib/format';
import { Card, Chip, SimBadge, SectionTitle, ProgressBar } from '@/components/ui';
import type { StorageFacility } from '@/lib/types';

const TYPE_ICON: Record<StorageFacility['type'], typeof Warehouse> = {
  'Cold Storage': Snowflake,
  Warehouse: Building2,
  'Shade Net': Tent,
};

export function StorageIntelligencePage() {
  const { farmer, setPage } = useApp();
  const ctx = buildContext(farmer);
  const [facilityId, setFacilityId] = useState(ctx.storageFacility?.id ?? STORAGE_FACILITIES[0].id);
  const [days, setDays] = useState(7);

  const facility = STORAGE_FACILITIES.find((f) => f.id === facilityId) ?? STORAGE_FACILITIES[0];

  const comparison = useMemo(() => {
    const storageCost = facility.chargePerQuintalPerDay * farmer.quantityQuintals * days;
    const extraTransport = Math.round(facility.distanceKm * 7 * (farmer.quantityQuintals / 50));
    const sellNow = ctx.best;

    const scenarios = [
      { label: 'Prices drop 10%', pct: -10, tone: 'red' as const },
      { label: 'Prices stay flat', pct: 0, tone: 'amber' as const },
      { label: 'Prices rise 10%', pct: 10, tone: 'lime' as const },
      { label: 'Prices rise 20%', pct: 20, tone: 'green' as const },
    ];

    const rows = scenarios.map((s) => {
      const futurePrice = Math.round(sellNow.pricePerQuintal * (1 + s.pct / 100));
      const gross = futurePrice * farmer.quantityQuintals;
      const sellExpenses = sellNow.transport + sellNow.loading + sellNow.commission + sellNow.other;
      const net = gross - sellExpenses - storageCost - extraTransport;
      return { ...s, futurePrice, gross, net, delta: net - sellNow.netEarnings };
    });

    return { sellNow, storageCost, extraTransport, rows };
  }, [facility, farmer.quantityQuintals, days, ctx.best]);

  const chartData = comparison.rows.map((r) => ({
    name: r.label.replace('Prices ', ''),
    Net: r.net,
    delta: r.delta,
    isPositive: r.delta >= 0,
  }));

  const sellNow = comparison.sellNow;

  return (
    <div className="space-y-6 py-6">
      <SectionTitle
        eyebrow="Storage Intelligence"
        title="Sell now or store and sell later?"
        desc="Compare immediate sale against storing your harvest for a period, under different future-price scenarios. Future prices are uncertain — storage does not guarantee higher earnings."
      />

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        <AlertTriangle size={20} className="shrink-0 text-amber-600" />
        <p>
          <strong>Important:</strong> Future market prices are uncertain. Storage adds cost and risk of spoilage. These figures are simulated scenarios — not predictions. The final decision is yours.
        </p>
      </div>

      {/* Storage facilities */}
      <div>
        <h3 className="font-display font-bold text-forest-900 mb-3">Storage facilities near you</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STORAGE_FACILITIES.map((f) => {
            const Icon = TYPE_ICON[f.type];
            const selected = f.id === facilityId;
            return (
              <Card
                key={f.id}
                className={classNames('p-4 cursor-pointer transition hover:shadow-cardLg', selected && 'ring-2 ring-forest-400')}
              >
                <div onClick={() => setFacilityId(f.id)}>
                  <div className="flex items-start justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-600">
                      <Icon size={20} />
                    </div>
                    {f.verified ? (
                      <Chip tone="green"><BadgeCheck size={10} /> Verified</Chip>
                    ) : (
                      <Chip tone="amber">Unverified</Chip>
                    )}
                  </div>
                  <div className="mt-3 font-display text-sm font-bold text-forest-900 leading-tight">{f.name}</div>
                  <div className="text-xs text-forest-500 flex items-center gap-1 mt-0.5"><MapPin size={11} /> {f.district} • {formatKm(f.distanceKm)}</div>
                  <div className="mt-3 space-y-1 text-xs">
                    <Row label="Type" value={f.type} />
                    <Row label="Rate" value={`₹${f.chargePerQuintalPerDay}/q/day`} />
                    <Row label="Capacity" value={f.capacityTons ? `${f.capacityTons} tons` : 'Not known'} />
                  </div>
                  {selected && <div className="mt-2 text-xs font-bold text-forest-600">✓ Selected for comparison</div>}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Days slider */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-forest-600" />
          <h3 className="font-display font-bold text-forest-900">Storage duration</h3>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="flex-1 accent-forest-600"
          />
          <div className="w-28 text-center">
            <span className="font-display text-xl font-bold text-forest-900">{days}</span>
            <span className="text-sm text-forest-500"> days</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
          <MiniStat label="Storage cost" value={formatINR(comparison.storageCost)} sub={`₹${facility.chargePerQuintalPerDay}/q × ${farmer.quantityQuintals}q × ${days}d`} />
          <MiniStat label="Extra transport" value={formatINR(comparison.extraTransport)} sub={`${formatKm(facility.distanceKm)} round trip`} />
          <MiniStat label="Facility" value={facility.name.split(' ').slice(0, 2).join(' ')} sub={facility.type} />
        </div>
      </Card>

      {/* Sell now vs Store later comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Option A: Sell now */}
        <Card className={classNames('p-5 border-2', 'border-forest-200')}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-forest-600 text-white"><Warehouse size={20} /></div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-forest-400">Option A</div>
                <div className="font-display font-bold text-forest-900">Sell now</div>
              </div>
            </div>
            <SimBadge />
          </div>
          <div className="space-y-2 text-sm">
            <Row label="Market" value={sellNow.marketName} />
            <Row label="Selling price" value={`₹${sellNow.pricePerQuintal}/quintal`} />
            <Row label="Quantity" value={`${farmer.quantityQuintals} quintals`} />
            <div className="border-t border-forest-50 pt-2" />
            <Row label="Gross revenue" value={formatINR(sellNow.grossRevenue)} />
            <Row label="Transport" value={`− ${formatINR(sellNow.transport)}`} />
            <Row label="Loading" value={`− ${formatINR(sellNow.loading)}`} />
            <Row label="Commission" value={`− ${formatINR(sellNow.commission)}`} />
            <div className="border-t border-forest-50 pt-2" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-forest-800">Estimated net earnings</span>
              <span className="font-display text-xl font-extrabold text-forest-600">{formatINR(sellNow.netEarnings)}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-xs text-forest-500 mb-1">Certainty</div>
            <ProgressBar pct={85} tone="green" />
            <div className="mt-1 text-[10px] text-forest-400">Based on today's simulated prices</div>
          </div>
        </Card>

        {/* Option B: Store and sell later */}
        <Card className="p-5 border-2 border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white"><Clock size={20} /></div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wide text-amber-600">Option B</div>
                <div className="font-display font-bold text-forest-900">Store &amp; sell later</div>
              </div>
            </div>
            <Chip tone="amber">Uncertain</Chip>
          </div>
          <div className="space-y-2 text-sm">
            <Row label="Storage facility" value={facility.name} />
            <Row label="Duration" value={`${days} days`} />
            <Row label="Storage cost" value={`− ${formatINR(comparison.storageCost)}`} />
            <Row label="Extra transport" value={`− ${formatINR(comparison.extraTransport)}`} />
            <div className="border-t border-forest-50 pt-2" />
            <div className="text-xs font-bold uppercase tracking-wide text-forest-400 mb-1">Scenario-based outcomes</div>
            {comparison.rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-lg bg-cream-50/50 px-2.5 py-1.5">
                <span className="flex items-center gap-1.5 text-forest-700">
                  <ScenarioIcon pct={r.pct} />
                  {r.label}
                </span>
                <span className="text-right">
                  <span className={classNames('font-bold', r.delta >= 0 ? 'text-forest-600' : 'text-rose-600')}>{formatINR(r.net)}</span>
                  <span className={classNames('ml-1.5 text-[10px]', r.delta >= 0 ? 'text-forest-500' : 'text-rose-500')}>
                    {r.delta >= 0 ? '+' : ''}{formatINR(r.delta)}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-xs text-forest-500 mb-1">Certainty</div>
            <ProgressBar pct={35} tone="amber" />
            <div className="mt-1 text-[10px] text-forest-400">Depends on unpredictable future prices</div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-forest-900">Net earnings by scenario (vs sell now)</h3>
          <SimBadge />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F1DF" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4C9B64' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4C9B64' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7F1DF', fontSize: 12 }} formatter={(v) => formatINR(Number(v))} />
              <ReferenceLine y={sellNow.netEarnings} stroke="#267348" strokeDasharray="4 4" label={{ value: 'Sell now', position: 'right', fill: '#267348', fontSize: 11 }} />
              <Bar dataKey="Net" radius={[6, 6, 0, 0]} name="Net earnings if stored">
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.isPositive ? '#4C9B64' : '#fb7185'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-forest-600">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-forest-400" /> Beats selling now</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-rose-400" /> Worse than selling now</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 bg-forest-600" /> Sell-now baseline</span>
        </div>
      </Card>

      {/* CTA */}
      <Card className="flex flex-col items-center gap-3 p-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <Calculator size={22} className="text-forest-400" />
          <div>
            <div className="font-display font-bold text-forest-900">Compare exact numbers yourself</div>
            <div className="text-sm text-forest-600">Open the net earnings calculator with your live inputs.</div>
          </div>
        </div>
        <button onClick={() => setPage('calculator')} className="btn-primary">
          Open calculator <ArrowRight size={16} />
        </button>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-forest-600">{label}</span>
      <span className="font-semibold text-forest-900 text-right">{value}</span>
    </div>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-cream-50/60 p-3">
      <div className="text-[10px] font-bold uppercase tracking-wide text-forest-400">{label}</div>
      <div className="font-display text-base font-bold text-forest-900">{value}</div>
      {sub && <div className="text-[10px] text-forest-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function ScenarioIcon({ pct }: { pct: number }) {
  if (pct > 0) return <TrendingUp size={13} className="text-forest-500" />;
  if (pct < 0) return <TrendingDown size={13} className="text-rose-500" />;
  return <Minus size={13} className="text-amber-500" />;
}
