import { useState, useMemo } from 'react';
import {
  Calculator as CalcIcon, Scale, TrendingUp, Truck, Package, Percent, Wallet,
  ArrowRight, Info, Trophy, Store, Sparkles,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';
import { useApp } from '@/lib/appContext';
import { MARKETS } from '@/lib/demoData';
import { bestByNetEarnings } from '@/lib/calc';
import { formatINR, classNames } from '@/lib/format';
import { Card, Chip, SimBadge, SectionTitle } from '@/components/ui';
import type { NetEarningsResult } from '@/lib/types';

interface MarketRow {
  marketId: string;
  marketName: string;
  pricePerQuintal: number;
  transport: number;
  loading: number;
  commissionPct: number;
  otherExpenses: number;
}

export function CalculatorPage() {
  const { farmer, setPage } = useApp();
  const [quantity, setQuantity] = useState(farmer.quantityQuintals || 50);
  const [rows, setRows] = useState<MarketRow[]>(() =>
    MARKETS.slice(0, 3).map((m) => ({
      marketId: m.id,
      marketName: m.name,
      pricePerQuintal: m.pricePerQuintal,
      transport: m.transportCost,
      loading: m.loadingCost,
      commissionPct: m.commissionPct,
      otherExpenses: 1000,
    }))
  );

  const computed = useMemo(() => {
    return rows.map((r) => {
      const gross = r.pricePerQuintal * quantity;
      const commission = Math.round((gross * r.commissionPct) / 100);
      const totalExpenses = r.transport + r.loading + commission + r.otherExpenses;
      return {
        marketId: r.marketId,
        marketName: r.marketName,
        grossRevenue: gross,
        transport: r.transport,
        loading: r.loading,
        commission,
        other: r.otherExpenses,
        totalExpenses,
        netEarnings: gross - totalExpenses,
        pricePerQuintal: r.pricePerQuintal,
        quantity,
      } as NetEarningsResult;
    });
  }, [rows, quantity]);

  const best = bestByNetEarnings(computed);
  const worst = computed.reduce((w, r) => (r.netEarnings < w.netEarnings ? r : w), computed[0]);
  const priceLeader = computed.reduce((p, r) => (r.pricePerQuintal > p.pricePerQuintal ? r : p), computed[0]);
  const maxNet = Math.max(...computed.map((r) => r.netEarnings));
  const chartData = computed.map((r) => ({
    name: r.marketName.split(' ')[0],
    Gross: r.grossRevenue,
    Expenses: r.totalExpenses,
    Net: r.netEarnings,
    isBest: r.marketId === best.marketId,
  }));

  const updateRow = (idx: number, patch: Partial<MarketRow>) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  return (
    <div className="space-y-6 py-6">
      <SectionTitle
        eyebrow="Centrepiece feature"
        title="Net Earnings Calculator"
        desc="Change quantity, price or expenses and every result updates instantly. See why the highest listed price isn't always the best net return."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inputs */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <CalcIcon size={20} className="text-forest-600" />
            <h3 className="font-display font-bold text-forest-900">Calculator inputs</h3>
            <SimBadge />
          </div>

          {/* Quantity */}
          <div className="mb-5">
            <label className="label-field flex items-center gap-2">
              <Scale size={16} className="text-forest-500" /> Quantity (quintals)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={200}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="flex-1 accent-forest-600"
              />
              <input
                type="number"
                className="input-field w-24 text-center font-bold"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Per-market rows */}
          <div className="space-y-4">
            {rows.map((row, i) => (
              <div key={i} className="rounded-xl border border-forest-50 bg-cream-50/40 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="grid h-7 w-7 place-items-center rounded-lg bg-forest-900 text-xs font-bold text-forest-200">{String.fromCharCode(65) + i}</div>
                  <span className="font-display text-sm font-bold text-forest-900">{row.marketName}</span>
                  {computed[i].marketId === best.marketId && <Chip tone="green"><Trophy size={10} /> Best net</Chip>}
                  {computed[i].marketId === priceLeader.marketId && computed[i].marketId !== best.marketId && <Chip tone="lime">Top price</Chip>}
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <NumField icon={<TrendingUp size={14} />} label="Price ₹/quintal" value={row.pricePerQuintal} onChange={(v) => updateRow(i, { pricePerQuintal: v })} />
                  <NumField icon={<Truck size={14} />} label="Transport ₹" value={row.transport} onChange={(v) => updateRow(i, { transport: v })} />
                  <NumField icon={<Package size={14} />} label="Loading ₹" value={row.loading} onChange={(v) => updateRow(i, { loading: v })} />
                  <NumField icon={<Percent size={14} />} label="Commission %" value={row.commissionPct} onChange={(v) => updateRow(i, { commissionPct: v })} step={0.5} />
                  <NumField icon={<Wallet size={14} />} label="Other expenses ₹" value={row.otherExpenses} onChange={(v) => updateRow(i, { otherExpenses: v })} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Result summary */}
        <div className="space-y-4">
          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-forest-900 to-forest-700 p-5 text-white">
              <div className="flex items-center gap-2 text-forest-200">
                <Trophy size={18} /> <span className="text-xs font-bold uppercase tracking-wide">Best net return</span>
              </div>
              <div className="mt-2 font-display text-lg font-bold leading-tight">{best.marketName}</div>
              <div className="mt-2 text-4xl font-extrabold">{formatINR(best.netEarnings)}</div>
              <div className="text-xs text-forest-100/60">for {quantity} quintals</div>
            </div>
            <div className="p-4 space-y-2.5 text-sm">
              <ResultRow label="Gross revenue" value={formatINR(best.grossRevenue)} />
              <ResultRow label="Transport" value={`− ${formatINR(best.transport)}`} />
              <ResultRow label="Loading" value={`− ${formatINR(best.loading)}`} />
              <ResultRow label="Commission" value={`− ${formatINR(best.commission)}`} />
              <ResultRow label="Other expenses" value={`− ${formatINR(best.other)}`} />
              <div className="border-t border-forest-50 pt-2.5">
                <ResultRow label="Total expenses" value={formatINR(best.totalExpenses)} bold />
                <ResultRow label="Net earnings" value={formatINR(best.netEarnings)} bold accent />
              </div>
            </div>
          </Card>

          {best.marketId !== priceLeader.marketId && (
            <Card className="border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-start gap-2">
                <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-display text-sm font-bold text-amber-800">Higher price ≠ higher earnings</div>
                  <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                    {priceLeader.marketName} lists ₹{priceLeader.pricePerQuintal}/q — ₹{priceLeader.pricePerQuintal - best.pricePerQuintal}/q more than {best.marketName}. But its transport is {formatINR(priceLeader.transport - best.transport)} higher, so you net {formatINR(best.netEarnings - priceLeader.netEarnings)} less.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Comparison bars */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-forest-900">Earnings comparison</h3>
          <SimBadge />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7F1DF" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4C9B64' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#4C9B64' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7F1DF', fontSize: 12 }} formatter={(v) => formatINR(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Gross" fill="#B7D96A" radius={[6, 6, 0, 0]} name="Gross revenue" />
              <Bar dataKey="Expenses" fill="#E7F1DF" radius={[6, 6, 0, 0]} name="Total expenses" />
              <Bar dataKey="Net" radius={[6, 6, 0, 0]} name="Net earnings">
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.isBest ? '#267348' : '#4C9B64'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Net earnings bars side-by-side */}
      <Card className="p-5">
        <h3 className="font-display font-bold text-forest-900 mb-4">Net earnings by market</h3>
        <div className="space-y-5">
          {computed.map((r) => {
            const pct = (r.netEarnings / maxNet) * 100;
            const isBest = r.marketId === best.marketId;
            return (
              <div key={r.marketId}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2 font-semibold text-forest-900">
                    {isBest ? <Trophy size={14} className="text-forest-500" /> : <Store size={14} className="text-forest-400" />}
                    {r.marketName}
                  </span>
                  <span className={classNames('font-bold', isBest ? 'text-forest-600' : 'text-forest-900')}>{formatINR(r.netEarnings)}</span>
                </div>
                <div className="h-4 w-full rounded-full bg-forest-50 overflow-hidden">
                  <div
                    className={classNames('h-full rounded-full transition-all duration-700', isBest ? 'bg-gradient-to-r from-forest-400 to-forest-600' : 'bg-forest-300')}
                    style={{ width: `${Math.max(2, pct)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-forest-400">
                  <span>Gross {formatINR(r.grossRevenue)}</span>
                  <span>Expenses {formatINR(r.totalExpenses)}</span>
                  <span className={r.netEarnings > best.netEarnings ? 'text-forest-600 font-bold' : ''}>
                    {r.marketId === best.marketId ? 'Best' : `${formatINR(r.netEarnings - best.netEarnings)} vs best`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-forest-50 pt-4">
          <div>
            <div className="text-xs text-forest-500">Gap between best &amp; worst</div>
            <div className="font-display text-lg font-bold text-forest-900">{formatINR(best.netEarnings - worst.netEarnings)}</div>
          </div>
          <div>
            <div className="text-xs text-forest-500">Best net per quintal</div>
            <div className="font-display text-lg font-bold text-forest-900">₹{Math.round(best.netEarnings / quantity)}</div>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <Card className="flex flex-col items-center gap-3 p-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <Sparkles size={22} className="text-forest-400" />
          <div>
            <div className="font-display font-bold text-forest-900">Want the full AI recommendation?</div>
            <div className="text-sm text-forest-600">See the explainable breakdown with risks and alternatives.</div>
          </div>
        </div>
        <button onClick={() => setPage('recommendation')} className="btn-primary">
          View recommendation <ArrowRight size={16} />
        </button>
      </Card>
    </div>
  );
}

function NumField({ icon, label, value, onChange, step = 1 }: { icon: React.ReactNode; label: string; value: number; onChange: (v: number) => void; step?: number }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wide text-forest-400 flex items-center gap-1 mb-1">{icon} {label}</label>
      <input
        type="number"
        step={step}
        className="input-field py-2 text-sm font-semibold"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  );
}

function ResultRow({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={classNames('text-forest-600', bold && 'font-semibold text-forest-800')}>{label}</span>
      <span className={classNames('font-semibold', accent ? 'text-forest-600 font-extrabold text-base' : 'text-forest-900')}>{value}</span>
    </div>
  );
}
